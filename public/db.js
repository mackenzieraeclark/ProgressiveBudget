// Set a new database  
let db;

// Create request for a "budget" database.
const request = indexedDB.open('budget', 1);

// Create object store for pending to autoincrement
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objStore = db.createObjectStore('budget', { autoIncrement: true });
  // Access the table and create a name and keypath 
  objStore.createIndex('pendingIndex', 'pending'); 
};

// Called on new request
request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

 // Calls and logs any errors 
request.onerror = function (event) {
  console.log('An error occured retrieving your data: ' + request.error);
};

// Saves the new record 
function saveRecord(record) {
  // Create a transaction on the pending db (with readwrite access)
  const transaction = db.transaction(['budget'], 'readwrite');
  // Access pending object store
  const objStore = transaction.objectStore('budget');
  // Add record to object store
  objStore.add(record);
}

// open a transaction on your pending db
function checkDatabase() {
  const transaction = db.transaction(['budget'], 'readwrite');
  const objStore = transaction.objectStore('budget');
  const getRequest = objStore.getAll();

  getRequest.onsuccess = function () {
    if (getRequest.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getRequest.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(() => {
          // Open a transaction in pending db
          const transaction = db.transaction(['budget'], 'readwrite');
          // Access pending object store
          const objStore = transaction.objectStore('budget');
          // Clear all items in store
          objStore.clear();
        });
    }
  };
}

// Listen for application to be back online
window.addEventListener('online', checkDatabase);