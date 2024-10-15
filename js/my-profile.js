document.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById("profileImage");
    const imageInput = document.getElementById("imageInput");
    const saveImageBtn = document.getElementById("saveImage");
  
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
  