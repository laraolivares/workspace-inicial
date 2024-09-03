document.addEventListener("DOMContentLoaded", function(){
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Convierte la respuesta a JSON
    })
    .then(data => {
        console.log('Datos recibidos:', data); // Verifica toda la estructura del JSON
        if (data && data.products){
            for(i=0; i<data.products.length; i++){
                if(localStorage.getItem("id") == "a_" + data.products[i].id){
                    var producto = data.products[i]
                    document.getElementById("produ_espec").innerHTML = `<img src="${producto.image}"></img>`
                    + `<h1>`+ producto.name + `</h1>` 
                    + `<p> <strong>Descripcion: </strong>`+ producto.description + `</p>`
                    + `<p> <strong>Precio: </strong>`+ producto.currency + producto.cost + `</p>`
                    +`<p> <strong>Vendidos: </strong>:`+ producto.soldCount + `</p>`
                }       
            }
        }
})})