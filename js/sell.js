let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA";

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
};

function updateBadge() {
    const carro = JSON.parse(localStorage.getItem('cart')) || []; // Parse the JSON string or use an empty array
    let contador_prod = 0; // Initialize the counter

    carro.forEach(item => {
        if (item.quantity) { // Ensure quantity exists before adding
            contador_prod += item.quantity; // Sum the quantities
        }
    });

    let badge = document.getElementById("badge");
    if (contador_prod > 0) {
        badge.classList.remove("visually-hidden"); // Show the badge
        badge.innerHTML = contador_prod; // Update the badge text
    } else {
        badge.classList.add("visually-hidden"); // Hide the badge if there are no items
    }

    console.log(contador_prod);
};

//Función para actualizar los costos de publicación
function updateTotalCosts(){
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

// Evento para cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function(e){
    // Add event listener for logout button
    const cerrarSesion = document.getElementById("cerrarSesion"); 
    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', logout);
    }

    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        updateTotalCosts();
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value;
        updateTotalCosts();
    });

    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = 0.13;
        updateTotalCosts();
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = 0.07;
        updateTotalCosts();
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = 0.03;
        updateTotalCosts();
    });

    document.getElementById("productCurrency").addEventListener("change", function(){
        if (this.value == DOLLAR_CURRENCY) {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        } else if (this.value == PESO_CURRENCY) {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts();
    });

    // Configuración para el elemento de carga de archivos.
    let dzoptions = {
        url: "/",
        autoQueue: false
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions);    

    // Formulario de venta de productos
    let sellForm = document.getElementById("sell-info");

    // Evento 'enviar' en el formulario
    sellForm.addEventListener("submit", function(e){
        e.preventDefault(); 

        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let infoMissing = false;

        // Eliminar clases no válidas
        productNameInput.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');

        // Validar nombre del producto
        if (productNameInput.value === "") {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        }
        
        // Validar categoría de producto
        if (productCategory.value === "") {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        }

        // Validar costo del producto
        if (productCost.value <= 0) {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        
        if (!infoMissing) {
            // Si pasan todas las validaciones, envía la solicitud para crear la publicación.
            getJSONData(PUBLISH_PRODUCT_URL).then(function(resultObj){
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";

                // Mostrar mensaje de éxito o error
                if (resultObj.status === 'ok') {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                } else if (resultObj.status === 'error') {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
    
                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            });
        }
    });
    updateBadge();
});


