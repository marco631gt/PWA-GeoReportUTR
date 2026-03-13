if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service worker registered', reg))
            .catch(err => console.warn('Error in SW register', err));
    });
}


const form = document.getElementById('form-inventory');
const inputProduct = document.getElementById('input-product');
const inputQuantity = document.getElementById('input-quantity');
const statusDiv = document.getElementById('status');

//Handle send form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const products = inputProduct.value.trim();
    const quantity = inputQuantity.value.trim();

    if (products !== "" && quantity !== "") {
        insertProductsTableDB(products, quantity);
        inputProduct.value = '';
        inputQuantity.value = '';
        inputProduct.focus();
    }
});


function updateOnlineStatus() {
    if (navigator.onLine) {
        statusDiv.textContent = 'Modo ONLINE';
        statusDiv.className = 'status-online';
        statusDiv.style.backgroundColor = 'green'; 
    } else {
        statusDiv.textContent = 'Modo OFFLINE';
        statusDiv.className = 'status-offline';
        statusDiv.style.backgroundColor = 'red';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();

// //CSR

// const tasklist = document.getElementById("task-list");

// //Array CSR

// const tareasLocales = [
//     "Tarea desde JS: Configurar entorno",
//     "Tarea desde JS: Probar Live Server",
//     "Tarea desde JS: Analizar el DOM",
// ]

// function renderLocalTasks() {
//     tasklist.innerHTML = "";
//     tareasLocales.forEach(tarea => {
//         const li = document.createElement("li");
//         li.textContent = tarea;
//         tasklist.appendChild(li);
//     });
// }

// renderLocalTasks ();

// async function fetchRemoteTasks() {
//     const container = document.getElementById("app-content");

//     //Mostrar estado de carga
//     container.innerHTML = '<p class="loading">Cargando datos de la API externa...</p>';

//     try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
//         const posts = await response.json();

//         //Limpiar contenedor y nueva lista
//         container.innerHTML = '<ul id="task-list"></ul>';
//         const newList = document.getElementById('task-list');

//         //Renderizar
//         posts.forEach(post => {
//             const li = document.createElement('li');
//             li.innerHTML = `<strong>${post.title}</strong><br><small>${post.body}</small>`;
//             newList.appendChild(li);
//         })
//     } catch (error) {
//         container.innerHTML = '<p style="color:red">Error al cargar los datos, tienes internet?</p>';
//         console.error("Error en fetch: ", error); l
//     }
// }

