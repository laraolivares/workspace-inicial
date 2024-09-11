document.addEventListener("DOMContentLoaded", function() {
    fetch('https://japceibal.github.io/emercado-api/products/' + localStorage.getItem('idProducto') + '.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data) {
                var info1 = `<p id="categ">${data.category}</p>
                             <h1>${data.name}</h1>`;

                let img = `<div id="carousel" class="carousel">
                               <button class="carousel-button prev">❮</button>
                               <div class="carousel-images">`;
                for (let i = 0; i < data.images.length; i++) {
                    img += `<img src="${data.images[i]}" alt="Product Image">`;
                }
                img += `</div>
                        <button class="carousel-button next">❯</button>
                    </div>`;

                var info2 = `<p>${data.description}</p>
                             <p>${data.currency} ${data.cost}</p>
                             <p>${data.soldCount} vendidos</p>`;

                document.getElementById("produ_espec").innerHTML = info1 + img + info2;
                
                initializeCarousel();

                document.getElementById("categ").addEventListener('click', function(){
                    window.location.href = 'products.html'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function initializeCarousel() {
        const carouselContainer = document.querySelector('#carousel .carousel-images');
        const images = carouselContainer.querySelectorAll('img');
        let currentIndex = 0;

        function showImage(index) {
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        document.querySelector('.carousel-button.next').addEventListener('click', () => {
            showImage(currentIndex + 1);
        });

        document.querySelector('.carousel-button.prev').addEventListener('click', () => {
            showImage(currentIndex - 1);
        });
    }
});
