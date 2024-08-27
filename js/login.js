document.addEventListener('DOMContentLoaded', function () {

 const botonEntrar = document.getElementById('boton-entrar');
 const inputUsuario = document.getElementById('inputUsuario');
 const inputContraseña = document.getElementById('inputContraseña');
 const icon = document.getElementById('icon');

 // Evento para el botón de entrar
 botonEntrar.addEventListener('click', function () {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();

  if (usuario === '' || contraseña === '') {
   alert('Completar usuario y contraseña');
  } else {
   // Guardar sesión en localStorage
   localStorage.setItem('loggedIn', 'true');
   localStorage.setItem('username', usuario);
   window.location.href = 'index.html'; // Desafiate Entrega 2
  }
 });

 // Mostrar/Ocultar contraseña
 icon.addEventListener("click", function() {
  if (inputContraseña.type === "password") {
   inputContraseña.type = "text";
  } else {
   inputContraseña.type = "password";
  }
 });
});

