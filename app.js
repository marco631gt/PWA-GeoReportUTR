// Registro del Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW registrado'))
        .catch(err => console.log('Error SW', err));

}

// Control de estado de conexión
const statusDiv = document.getElementById('status');
const updateStatus = () => {
    const isOnline = navigator.onLine;
    statusDiv.textContent = isOnline ? 'CONNECTED - Online Mode' : 'No conection - Offline Mode';
    statusDiv.className = isOnline ? 'status-online' : 'status-offline';
};
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

// Configuración de Notificaciones
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

function notify(msg) {
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification('GeoReport UTR', {
                body: msg,
                icon: 'images/icon-192.png'
            });
        });
    }
}

// Obtención de Coordenadas GPS
const getCoords = () => {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            err => {
                console.warn("GPS denied");
                resolve({ lat: 0, lng: 0 });
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    });
};

// Tomar fotos
const form = document.getElementById('form-report');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photoPreview = document.getElementById('temp-preview');
const photoText = document.getElementById('photo-text');
const inputPhoto = document.getElementById('input-photo');
const cameraLiveDiv = document.getElementById('camera-live');
let streamInstance = null;
let capturedBlob = null; 

// Seleccionar archivos
document.getElementById('btn-use-file').addEventListener('click', () => {
    stopCamera();
    inputPhoto.click();
});

inputPhoto.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            capturedBlob = e.target.result;
            showPreview(capturedBlob);
        };
        reader.readAsDataURL(this.files[0]);
    }
});

// Tomar foto desde la camara
document.getElementById('btn-use-camera').addEventListener('click', async () => {
    cameraLiveDiv.style.display = 'block';
    photoPreview.style.display = 'none';
    try {
        streamInstance = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });
        video.srcObject = streamInstance;
    } catch (err) {
        alert("No access to the camara: " + err);
        cameraLiveDiv.style.display = 'none';
    }
});

document.getElementById('btn-capture').addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedBlob = canvas.toDataURL('image/jpeg');
    showPreview(capturedBlob);
    stopCamera();
});

function showPreview(src) {
    photoPreview.src = src;
    photoPreview.style.display = 'block';
    cameraLiveDiv.style.display = 'none';
    photoText.innerText = "¡Photo Done!";
    photoText.style.color = "#059669";
    document.querySelector('.camera-label')?.classList.add('captured');
}

function stopCamera() {
    if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
        streamInstance = null;
    }
    cameraLiveDiv.style.display = 'none';
}

// Enviar reporte
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!capturedBlob) {
        return alert("Mandatory take photo");
    }

    try {
        const coords = await getCoords();

        const report = {
            title: document.getElementById('input-title').value,
            desc: document.getElementById('input-desc').value,
            photo: capturedBlob,
            lat: coords.lat,
            lng: coords.lng,
            date: new Date().toLocaleString()
        };

        await saveReportDB(report);

        const statusMsg = navigator.onLine ? "Report send succesfully" : "Saved while waiting for connection (Offline)";
        notify(statusMsg);

        resetForm();

    } catch (error) {
        console.error(error);
        alert("Error proccessing the report");
    }
});

function resetForm() {
    form.reset();
    capturedBlob = null;
    photoPreview.style.display = 'none';
    photoPreview.src = "";
    photoText.innerText = "TAKE A PHOTO OF THE INCIDENT";
    photoText.style.color = "";
    document.querySelector('.camera-label')?.classList.remove('captured');
}