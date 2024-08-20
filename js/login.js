document.addEventListener('DOMContentLoaded', function () {
  const botonEntrar = document.getElementById('boton-entrar');
  
  botonEntrar.addEventListener('click', function () {
    const inputUsuario = document.getElementById('inputUsuario').value.trim();
    const inputContraseña = document.getElementById('inputContraseña').value.trim();
    
  


//OCULTAR/MOSTRAR CONTRSEÑA
let contraseña = document.getElementById('inputContraseña');
let icon = document.getElementById('icon');

icon.addEventListener("click", function() {
  if (contraseña.type === "password") {
    contraseña.type = "text";
     
  } else {
    contraseña.type = "password";
  }
})

    // if (inputUsuario === 'user' && inputContraseña === 'password') {
        // Guardar sesión en localStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', inputUsuario);
        window.location.href = 'https://laraolivares.github.io/workspace-inicial/';
    
  // NO SE COMO SE HACE PARA VERIFICAR SI EL USUARIO Y LA CONTRASEÑA ESTAN OK. DONDE SE ALMACENA ESA INFO??

  //} else {
  //  alert('Usuario o contraseña incorrectos');
    }
//  }
 });
});

