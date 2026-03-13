let db;
const request = indexedDB.open('InventoryDB', 1)

// Verificar si existe DB
request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('productsTable')) {
        db.createObjectStore('productsTable', { keyPath: 'id', autoIncrement: true });
    }
}

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexDB ready');
    showProducts(); //SHOW TASK LIST

}


function insertProductsTableDB(productName, quantity) {
    const transaction = db.transaction(['productsTable'], 'readwrite');
    const store = transaction.objectStore('productsTable');

    const newProduct = {
        productName: productName,
        quantity: quantity,
        fecha: new Date().toLocaleDateString()
    };

    const query = store.add(newProduct);

    query.onsuccess = () => {
        console.log('Task saved in DB');
        showProducts(); //SHOW TASK LIST
    };
}

function showProducts() {
    const listaUl = document.getElementById('products-list');
    listaUl.innerHTML = ''; //Clean HTML

    const transaction = db.transaction(['productsTable'], 'readonly');
    const store = transaction.objectStore('productsTable')
    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const li = document.createElement('li');
            li.innerHTML = `
            <span>Product: ${cursor.value.productName}</span>
            <span>Quantity: ${cursor.value.quantity}</span>
            <small>Date: ${cursor.value.fecha}</small>
            `;

            listaUl.appendChild(li);
            cursor.continue();
        }
    }
}


