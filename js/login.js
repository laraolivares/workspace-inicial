



if (inputUsuario === '' || inputContraseña === '') {
      alert('Completar usuario y contraseña');
    } else {
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
