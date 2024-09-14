function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('productsContainer');
    const searchBar = document.getElementById('search-bar');
    const filterBtn = document.getElementById('filterBtn');
    const sortPriceAsc = document.getElementById('sortPriceAsc');
    const sortPriceDesc = document.getElementById('sortPriceDesc');
    const sortRelevanceDesc = document.getElementById('sortRelevanceDesc');
    
    let products = [];

    const catID = localStorage.getItem("catID");

    // Function to render products
    function renderProducts(productsToRender) {
        container.innerHTML = ''; // Clear the container
        productsToRender.forEach((product, index) => {
            // Create a container div for each product
            const productContainer = document.createElement('div');
            productContainer.className = 'product-container'; // Add class
            productContainer.id = `product-${product.id}`;
            productContainer.addEventListener('click', function() {
                localStorage.setItem('idProducto', product.id);
                window.location.href = 'product-info.html'; // Assuming this is the page to view product details
            });

            // Create a div for the image
            const imageDiv = document.createElement('div');
            imageDiv.className = 'product-image'; // Add class
            const imgElement = document.createElement('img');
            imgElement.src = product.image;
            imgElement.alt = product.name;
            imageDiv.appendChild(imgElement);
            productContainer.appendChild(imageDiv);

            // Create a div for text information
            const textDiv = document.createElement('div');
            textDiv.className = 'product-text'; // Add class

            // Add product name
            const nameP = document.createElement('p');
            nameP.textContent = product.name;
            nameP.className = 'product-name'; // Corrected class assignment
            textDiv.appendChild(nameP);

            // Add product description, cost, and currency
            const descriptionP = document.createElement('p');
            descriptionP.innerHTML = `${product.description}<br><br><strong>${product.currency} ${product.cost}</strong>`;
            descriptionP.className = 'product-description'; // Corrected class assignment
            textDiv.appendChild(descriptionP);

            // Add sold count
            const soldCountP = document.createElement('p');
            soldCountP.textContent = `${product.soldCount} vendidos`;
            textDiv.appendChild(soldCountP);

            // Append textDiv to productContainer
            productContainer.appendChild(textDiv);

            // Append productContainer to the main container
            container.appendChild(productContainer);
        });
    }

    // Function to filter products based on search input
    function filterProducts(query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.soldCount.toString().includes(lowerCaseQuery)
        );
        renderProducts(filteredProducts);
    }

    // Fetch products data
    fetch("https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(data => {
            if (data && data.products) {
                products = data.products; // Save products globally
                renderProducts(products); // Initial render of all products

                // Add event listener to the search bar
                searchBar.addEventListener('input', (event) => {
                    const query = event.target.value;
                    filterProducts(query);
                });

                // Add event listener to the filter button
                filterBtn.addEventListener('click', function() {
                    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
                    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
                    const filteredProducts = products.filter(product =>
                        product.cost >= minPrice && product.cost <= maxPrice
                    );
                    renderProducts(filteredProducts);
                });

                // Add event listeners for sorting
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
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

// On window load check for login status
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
};
