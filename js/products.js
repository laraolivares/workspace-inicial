function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}


function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

function updateBadge() {
    const carro = JSON.parse(localStorage.getItem('cart')) || []; 
    let contador_prod = 0; // Empieza el contador
    
    carro.forEach(item => {
        if (item.quantity) { 
            contador_prod += item.quantity; 
        }
    });

    let badge = document.getElementById("badge");
    if (contador_prod > 0) {
        badge.classList.remove("visually-hidden");
        badge.innerHTML = contador_prod;
    } else {
        badge.classList.add("visually-hidden");
    }

    console.log(contador_prod);
};

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('productsContainer');
    const searchBar = document.getElementById('search-bar');
    const filterBtn = document.getElementById('filterBtn');
    const sortPriceAsc = document.getElementById('sortPriceAsc');
    const sortPriceDesc = document.getElementById('sortPriceDesc');
    const sortRelevanceDesc = document.getElementById('sortRelevanceDesc');
    const clearFilterBtn = document.getElementById('clearFilterBtn');  
    const cerrarSesion = document.getElementById("cerrarSesion"); 

    // Cerrar sesion desde el dropdown menu
    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', logout);
    }
    let products = [];

    const catID = localStorage.getItem("catID");

    // Funcion render
    function renderProducts(productsToRender) {
        container.innerHTML = '';
        productsToRender.forEach((product, index) => {
            // Crea container div para cada producto
            const productContainer = document.createElement('div');
            productContainer.className = 'product-container';
            productContainer.id = `product-${product.id}`;
            productContainer.addEventListener('click', function() {
                localStorage.setItem('idProducto', product.id);
                window.location.href = 'product-info.html';
            });

            // Crea div para la imagen
            const imageDiv = document.createElement('div');
            imageDiv.className = 'product-image'; // Add class
            const imgElement = document.createElement('img');
            imgElement.className = 'image-product'
            imgElement.src = product.image;
            imgElement.alt = product.name;
            imageDiv.appendChild(imgElement);
            productContainer.appendChild(imageDiv);

            // Crea div para la info
            const textDiv = document.createElement('div');
            textDiv.className = 'product-text';

            // Agrega nombre del producto
            const nameP = document.createElement('p');
            nameP.textContent = product.name;
            nameP.className = 'product-name';
            textDiv.appendChild(nameP);

            // Agrega desc, costo y moneda del producto
            const descriptionP = document.createElement('p');
            descriptionP.innerHTML = `${product.description}<br><br><strong>${product.currency} ${product.cost}</strong>`;
            descriptionP.className = 'product-description';
            textDiv.appendChild(descriptionP);

            
            const soldCountP = document.createElement('p');
            soldCountP.textContent = `${product.soldCount} vendidos`;
            textDiv.appendChild(soldCountP);

            productContainer.appendChild(textDiv);

            container.appendChild(productContainer);
        });
    }

    // Funcion filtro
    function filterProducts(query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.soldCount.toString().includes(lowerCaseQuery)
        );
        renderProducts(filteredProducts);
    }

    function clearFilters() {
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        searchBar.value = '';
        filteredProducts = products;
        renderProducts(filteredProducts);
    }

    fetch("https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products) {
                products = data.products; 
                renderProducts(products); 

                // Event listener para la barra de busqueda
                searchBar.addEventListener('input', (event) => {
                    const query = event.target.value;
                    filterProducts(query);
                });

                // Event listener para el boton de filtro
                filterBtn.addEventListener('click', function() {
                    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
                    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
                    const filteredProducts = products.filter(product =>
                        product.cost >= minPrice && product.cost <= maxPrice
                    );
                    renderProducts(filteredProducts);
                });

                // Event listeners para el orden
                sortPriceAsc.addEventListener('click', function() {
                    const sortedProducts = [...products].sort((a, b) => a.cost - b.cost);
                    renderProducts(sortedProducts);
                });

                sortPriceDesc.addEventListener('click', function() {
                    const sortedProducts = [...products].sort((a, b) => b.cost - a.cost);
                    renderProducts(sortedProducts);
                });

                sortRelevanceDesc.addEventListener('click', function() {
                    const sortedProducts = [...products].sort((a, b) => b.soldCount - a.soldCount);
                    renderProducts(sortedProducts);
                });
               
                clearFilterBtn.addEventListener('click', clearFilters);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});


window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
    updateBadge();
};
