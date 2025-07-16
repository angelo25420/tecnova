function login() {
  const usuario = document.getElementById("usuario").value.trim().toLowerCase();
  const clave = document.getElementById("clave").value;

  const credenciales = {
    admin: "1234",
    angelo: "4444",
  };

  if (credenciales[usuario] === clave) {
    alert("✅ Bienvenido " + usuario.toUpperCase());
    sessionStorage.setItem("rol", usuario);

    setTimeout(() => {
      window.location.href = "tienda.html";
    }, 400);
  } else {
    alert("❌ Usuario o contraseña incorrectos");
  }
}
