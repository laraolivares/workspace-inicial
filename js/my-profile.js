function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html";
}


function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

window.onload = function() {
  const estaLogueado = localStorage.getItem('loggedIn');
  if (!estaLogueado) {
      window.location.href = 'login.html';
  } else {
      const username = localStorage.getItem('username');
      document.getElementById("username").innerHTML = username;
  }
};


document.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById("profileImage");
    const imageInput = document.getElementById("imageInput");
    const saveImageBtn = document.getElementById("saveImage");
    const cerrarSesion = document.getElementById("cerrarSesion"); 

                    // Cerrar sesion desde el dropdown menu
                    if (cerrarSesion) {
                        cerrarSesion.addEventListener('click', logout);
                    }
  
    // Cargar la imagen del localStorage si está guardada
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      profileImage.src = storedImage;
    }
  
    // Evento para guardar la imagen seleccionada
    saveImageBtn.addEventListener("click", function() {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          const base64String = reader.result;
          localStorage.setItem("profileImage", base64String);
          profileImage.src = base64String; // Mostrar la nueva imagen
        };
        reader.readAsDataURL(file); 
      } else {
        alert("Seleccionar imagen de perfil");
      }
    });
  });
  