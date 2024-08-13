// Usar getJSONData y manejar los datos
document.addEventListener("DOMContentLoaded", function() {
    getJSONData("https://japceibal.github.io/emercado-api/cats_products/101.json")
        .then(result => {
            if (result.status === 'ok') // Asegúrate de que los datos existen y tienen la estructura esperada
            {
                const products = result.data.products; 
                if (products && products.length > 0) {
                   document.getElementById("auto1").innerHTML = products[0].name + `<br>` + // Establezco que datos tomar de mi JSON, y que hacer con ellos
                   products[0].description + `<br>` + 
                   products[0].currency + " " + products[0].cost + `<br>` +
                   products[0].soldCount + " vendidos" 
                   document.getElementById("img.auto1").src = products[0].image

                   document.getElementById("auto2").innerHTML = products[1].name + `<br>` +
                   products[1].description + `<br>` + 
                   products[1].currency + " " + products[1].cost + `<br>` +
                   products[1].soldCount + " vendidos" 
                   document.getElementById("img.auto2").src = products[1].image

                   document.getElementById("auto3").innerHTML = products[2].name + `<br>` +
                   products[2].description + `<br>` + 
                   products[2].currency + " " + products[2].cost + `<br>` +
                   products[2].soldCount + " vendidos" 
                   document.getElementById("img.auto3").src = products[2].image

                   document.getElementById("auto4").innerHTML = products[3].name + `<br>` +
                   products[3].description + `<br>` + 
                   products[3].currency + " " + products[3].cost + `<br>` +
                   products[3].soldCount + " vendidos" 
                   document.getElementById("img.auto4").src = products[3].image

                   document.getElementById("auto5").innerHTML = products[4].name + `<br>` +
                   products[4].description + `<br>` + 
                   products[4].currency + " " + products[4].cost + `<br>` +
                   products[4].soldCount + " vendidos" 
                   document.getElementById("img.auto5").src = products[4].image
                } else {
                    console.error("No products found or products is not an array");
                }
            } else {
                console.error("Error fetching data: ", result.data);
            }
        });
});





