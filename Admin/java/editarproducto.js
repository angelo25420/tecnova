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
const contenedor = document.getElementById("productCatalog");

db.ref("productos")
  .once("value")
  .then((snapshot) => {
    contenedor.innerHTML = "";

    if (!snapshot.exists()) {
      contenedor.innerHTML =
        '<p style="text-align:center;">No hay productos disponibles.</p>';
      return;
    }

    snapshot.forEach((child) => {
      const producto = child.val();
      const id = child.key;

      const tarjeta = document.createElement("div");
      tarjeta.className = "product-card";
      tarjeta.id = `card-${id}`;

      tarjeta.innerHTML = `
          <img src="${
            producto.imagenUrl || "https://via.placeholder.com/200"
          }" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p><strong>Marca:</strong> ${producto.marca || "Sin marca"}</p>
          
          <label>Precio:</label><br>
          <input type="number" id="precio-${id}" value="${
        producto.precio
      }" step="0.01"><br>

          <label>Cantidad:</label><br>
          <input type="number" id="cantidad-${id}" value="${
        producto.cantidad
      }"><br><br>

          <button onclick="actualizarProducto('${id}')">Actualizar</button>
          <button onclick="eliminarProducto('${id}')">Eliminar</button>
        `;

      contenedor.appendChild(tarjeta);
    });
  });

function actualizarProducto(id) {
  const nuevoPrecio = parseFloat(document.getElementById(`precio-${id}`).value);
  const nuevaCantidad = parseInt(
    document.getElementById(`cantidad-${id}`).value
  );

  if (isNaN(nuevoPrecio) || isNaN(nuevaCantidad)) {
    alert("Por favor, ingresa valores válidos.");
    return;
  }

  firebase
    .database()
    .ref("productos/" + id)
    .update({
      precio: nuevoPrecio,
      cantidad: nuevaCantidad,
      editado: true,
    })
    .then(() => {
      mostrarMensaje("✅ Producto actualizado correctamente");

      const tarjeta = document.getElementById(`card-${id}`);
      tarjeta.style.border = "2px solid #00ff88";
      tarjeta.style.boxShadow = "0 0 15px #00ff88";

      setTimeout(() => {
        tarjeta.style.border = "";
        tarjeta.style.boxShadow = "";
      }, 2000);
    })
    .catch((error) => {
      alert("Error al actualizar: " + error.message);
    });
}

function eliminarProducto(id) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    firebase
      .database()
      .ref("productos/" + id)
      .remove()
      .then(() => {
        mostrarMensaje("🗑️ Producto eliminado");
        document.getElementById(`card-${id}`).remove();
      })
      .catch((error) => {
        alert("Error al eliminar: " + error.message);
      });
  }
}

function mostrarMensaje(texto) {
  let mensaje = document.createElement("div");
  mensaje.innerText = texto;
  mensaje.style.position = "fixed";
  mensaje.style.bottom = "20px";
  mensaje.style.right = "20px";
  mensaje.style.backgroundColor = "#00ff88";
  mensaje.style.color = "#003f5c";
  mensaje.style.padding = "12px 18px";
  mensaje.style.borderRadius = "8px";
  mensaje.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  mensaje.style.zIndex = "9999";
  mensaje.style.fontWeight = "bold";
  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.remove();
  }, 3000);
}
