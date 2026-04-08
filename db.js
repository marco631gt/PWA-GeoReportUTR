let db;
const request = indexedDB.open('GeoReportDB', 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('reports')) {
        db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('IndexedDB lista');
    showReports();
};

function saveReportDB(report) {
    const transaction = db.transaction(['reports'], 'readwrite');
    const store = transaction.objectStore('reports');
    store.add(report);
    transaction.oncomplete = () => showReports();
}

function showReports() {
    const list = document.getElementById('reports-list');
    list.innerHTML = '';
    const transaction = db.transaction(['reports'], 'readonly');
    const store = transaction.objectStore('reports');
    
    store.openCursor(null, 'prev').onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const card = document.createElement('li');
            card.className = 'report-card';
            card.innerHTML = `
                <strong>${cursor.value.title}</strong>
                <p>${cursor.value.desc}</p>
                <small>📍 Lat: ${cursor.value.lat.toFixed(4)}, Lng: ${cursor.value.lng.toFixed(4)}</small>
                <img src="${cursor.value.photo}">
            `;
            list.appendChild(card);
            cursor.continue();
        }
    };
}