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

function updateBadge() {
  const carro = JSON.parse(localStorage.getItem('cart')) || []; // Parse the JSON string or use an empty array
  let contador_prod = 0; // Initialize the counter

  carro.forEach(item => {
      if (item.quantity) { // Ensure quantity exists before adding
          contador_prod += item.quantity; // Sum the quantities
      }
  });

  let badge = document.getElementById("badge");
  if (contador_prod > 0) {
      badge.classList.remove("visually-hidden"); // Show the badge
      badge.innerHTML = contador_prod; // Update the badge text
  } else {
      badge.classList.add("visually-hidden"); // Hide the badge if there are no items
  }

  console.log(contador_prod);
}


document.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById("profileImage");
    const imageInput = document.getElementById("imageInput");
    const saveImageBtn = document.getElementById("saveImage");
    const cameraIcon = document.getElementById("cameraIcon");
    const cerrarSesion = document.getElementById("cerrarSesion"); 

                    // Cerrar sesion desde el dropdown menu
                    if (cerrarSesion) {
                        cerrarSesion.addEventListener('click', logout);
                    }
  
   if (cameraIcon) {
    // Abrir el selector de archivos al hacer clic en el ícono de la cámara
    cameraIcon.addEventListener("click", function() {
      imageInput.click();
    });
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

    const email = document.getElementById("email");
    const nombre = document.getElementById("nombre");    
    const seg_nombre = document.getElementById("seg_nombre");
    const apellido = document.getElementById("apellido");
    const seg_apellido = document.getElementById("seg_apellido");
    const telefono = document.getElementById("tel");
    const btnCambios = document.getElementById("btnCambios");
    //Los datos del local storage quedan en el formulario
    if(localStorage.getItem("loggedIn")){
      email.value = localStorage.getItem("username") //Guardado durante el inicio de sesion
      nombre.value = localStorage.getItem("Name") //Guardado en modificaciones previas del perfil
      seg_nombre.value = localStorage.getItem("Seg_Name") //Guardado en modificaciones previas del perfil
      apellido.value = localStorage.getItem("apellido")  //Guardado en modificaciones previas del perfil
      seg_apellido.value = localStorage.getItem("seg_apellido")  //Guardado en modificaciones previas del perfil
      telefono.value = localStorage.getItem("tel")  //Guardado en modificaciones previas del perfil
    };
    //Guardamos datos en el localStorage
    btnCambios.addEventListener('click',function(){
      if(nombre.value.trim() === ""){
        alert("Debe ingresar su nombre al perfil para guardar los cambios")
      }
      else if(apellido.value.trim() === ""){
        alert("Debe ingresar su apellido al perfil para guardar los cambios")
      }
      else{
        localStorage.setItem("Name", nombre.value.trim())
        localStorage.setItem("apellido", apellido.value.trim())
        alert("Los cambios han sido guardados con exito!")
        if(seg_nombre.value.trim() !== ""){
          localStorage.setItem("seg_Name", seg_nombre.value.trim())
        };
        if(seg_apellido.value.trim() !== ""){
          localStorage.setItem("seg_apellido", seg_apellido.value.trim())
        };
        if(telefono.value.trim() !== ""){
          localStorage.setItem("tel", telefono.value.trim())
        };
      };
    });
    const bdark = document.querySelector('#bdark');
    const body = document.querySelector('body');

    load();

    bdark.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('darkmode');
        store(isDarkMode);
        bdark.textContent = isDarkMode ? 'Modo claro' : 'Modo oscuro'; // Cambia el texto del botón
    });
    
    function load() {
        const darkmode = localStorage.getItem('darkmode');
        if (darkmode === 'true') {
            body.classList.add('darkmode');
            bdark.textContent = 'Modo claro'; // Cambia el texto si está en modo oscuro
        } else {
            store('false'); // Guarda como 'false' si no hay nada
        }
    }

    // Para guardar el modo oscuro en localStorage    
    function store(value){
        localStorage.setItem('darkmode', value);
    }
    updateBadge();
  });
