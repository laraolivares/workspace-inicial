document.addEventListener("DOMContentLoaded", function() {
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verifica toda la estructura del JSON
            if (data && data.products) {
                for (let i = 0; i < data.products.length; i++) {
                    const product = data.products[i];
                    
                    // Establecer el contenido para el elemento de producto
                    const productElement = document.getElementById("auto" + (i + 1));
                    if (productElement) {
                        productElement.innerHTML = product.name + `<br>`
                            + product.description + `<br>`
                            + product.currency + " " + product.cost + `<br>`
                            + product.soldCount + " vendidos";
                    } else {
                        console.error(`Elemento con ID "auto${i + 1}" no encontrado`);
                    }

                    // Establecer el src para la imagen si el elemento es una imagen
                    const imgElement = document.getElementById("img.auto" + (i + 1));
                    if (imgElement) {
                        imgElement.src = product.image;
                    } else {
                        console.error(`Elemento de imagen con ID "img${i + 1}" no encontrado`);
                    }
                }
            } else {
                console.error('La propiedad products no está disponible en los datos:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Maneja cualquier error
        });
});