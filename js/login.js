document.addEventListener('DOMContentLoaded', function () {
  const botonEntrar = document.getElementById('boton-entrar');
  
  botonEntrar.addEventListener('click', function () {
    const inputUsuario = document.getElementById('inputUsuario').value.trim();
    const inputContraseña = document.getElementById('inputContraseña').value.trim();
    
    
    if (inputUsuario === '' || inputContraseña === '') {
      alert('Completar usuario y contraseña');
    } else {
      
      window.location.href = 'https://laraolivares.github.io/workspace-inicial/'; 
    }
  });
});
