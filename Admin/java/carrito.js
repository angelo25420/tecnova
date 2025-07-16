const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "kiark-12902.firebaseapp.com",
  databaseURL: "https://kiark-12902-default-rtdb.firebaseio.com/",
  projectId: "kiark-12902",
  storageBucket: "kiark-12902.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const contenedor = document.getElementById("tablaHistorial");

db.ref("historial")
  .once("value")
  .then((snapshot) => {
    let tabla = `
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
      `;

    const compras = [];
    snapshot.forEach((child) => {
      const m = child.val();
      if (m.tipo === "salida") compras.push(m);
    });

    if (compras.length === 0) {
      contenedor.innerHTML =
        '<p class="vacio">No has realizado ninguna compra.</p>';
      return;
    }

    db.ref("productos")
      .once("value")
      .then((productosSnap) => {
        compras.forEach((c) => {
          const producto = Object.values(productosSnap.val()).find(
            (p) => p.nombre === c.productoId
          );
          const imagen = producto
            ? producto.imagenUrl
            : "https://via.placeholder.com/100";

          tabla += `
            <tr>
              <td><img src="${imagen}" alt="${c.productoId}"></td>
              <td>${c.productoId}</td>
              <td>${c.cantidad}</td>
              <td>S/ ${parseFloat(c.precioUnitario).toFixed(2)}</td>
              <td>S/ ${parseFloat(c.total).toFixed(2)}</td>
              <td>${c.fecha}</td>
            </tr>
          `;
        });

        tabla += `</tbody></table>`;
        contenedor.innerHTML = tabla;
      });
  });

// Ocultar robot después de 30 segundos
setTimeout(() => {
  const robot = document.getElementById("robot-loader");
  if (robot) robot.style.display = "none";
}, 15000);
