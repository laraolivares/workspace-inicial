function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

const catID = localStorage.getItem("catID");

document.addEventListener("DOMContentLoaded", function() {

    let products = [];

    fetch("https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Check the entire JSON structure
            const container = document.getElementById('productsContainer'); 

            if (data && data.products) {
                products = data.products;

// Function to render products
function renderProducts(products) {
    container.innerHTML = ''; // Clear the container
    products.forEach((product, index) => {

// Create a container div for each product
    const productContainer = document.createElement('div');
    productContainer.className = 'product-container'; // Add class
    productContainer.id = `product-${index}`; // Add unique ID

// Create a div for the image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image'; // Add class
    imageDiv.id = `product-image-${index}`; // Add unique ID

// Add product image
    const imgElement = document.createElement('img');
    imgElement.src = product.image;
    imgElement.alt = product.name;
    imgElement.id = `product-imaElement-${index}`; // Add unique ID
    imageDiv.appendChild(imgElement);

// Append imageDiv to productContainer
    productContainer.appendChild(imageDiv);

// Append the productContainer to the main container
    container.appendChild(productContainer);

// Create a div for text information
    const textDiv = document.createElement('div');
    textDiv.className = 'product-text'; // Add class
    textDiv.id = `product-text-${index}`; // Add unique ID

// Add product name
    const nameP = document.createElement('p');
    nameP.textContent = product.name;
    nameP.id = `product-name-${index}`; // Add unique ID
    textDiv.appendChild(nameP);

// Add product description, cost, and currency
    const descriptionP = document.createElement('p');
    descriptionP.innerHTML = `${product.description}<br><br><strong>${product.currency} ${product.cost}</strong>`;
    descriptionP.id = `product-description-${index}`; // Add unique ID
    textDiv.appendChild(descriptionP);

// Add sold count
    const soldCountP = document.createElement('p');
    soldCountP.textContent = `${product.soldCount} vendidos`;
    soldCountP.id = `product-soldCount-${index}`; // Add unique ID
    textDiv.appendChild(soldCountP);

// Append textDiv to productContainer
    productContainer.appendChild(textDiv);
});
}

// Initial rendering
renderProducts(products);


// Botón filtro event listener
document.getElementById('filterBtn').addEventListener('click', function() {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;


    const filteredProducts = products.filter(product =>
        product.cost >= minPrice && product.cost <= maxPrice
    );
   
    renderProducts(filteredProducts);
});

// Ordenar por precio ascendente
document.getElementById('sortPriceAsc').addEventListener('click', function() {
    const sortedProducts = [...products].sort((a, b) => a.cost - b.cost);
    renderProducts(sortedProducts);
});


// Ordenar por precio descendente
document.getElementById('sortPriceDesc').addEventListener('click', function() {
    const sortedProducts = [...products].sort((a, b) => b.cost - a.cost);
    renderProducts(sortedProducts);
});


// Ordenar por relevancia (por los más vendidos)
document.getElementById('sortRelevanceDesc').addEventListener('click', function() {
    const sortedProducts = [...products].sort((a, b) => b.soldCount - a.soldCount);
    renderProducts(sortedProducts);
});

            } else {
                console.error('La propiedad products no está disponible en los datos:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
});

                    
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username ;
    }
};



