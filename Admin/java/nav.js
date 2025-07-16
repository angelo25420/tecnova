document.addEventListener("DOMContentLoaded", () => {
  const navegadores = document.querySelectorAll(".navigator");
  const rol = sessionStorage.getItem("rol");

  let contenido = "";

  if (rol === "admin") {
    contenido = `
      <li><a href="productos_manager.html">Gestión</a></li>

      <li><a href="productos.html">Productos</a></li>
      <li><a href="info.html">Información</a></li>
      <li><a href="historialentrada.html">Entradas</a></li>
      <li><a href="historialsalida.html">Salidas</a></li>
      <li><a href="cuenta.html">Cerrar sesión</a></li>
    `;
  } else if (rol) {
    contenido = `
      <li><a href="tienda.html">Tienda</a></li>
      <li><a href="info.html">Información</a></li>
      <li><a href="carrito.html">carrito</a></li>
      <li><a href="cuenta.html">Cerrar sesión</a></li>
    `;
  }

  navegadores.forEach(nav => {
    nav.innerHTML = contenido;
  });
});
