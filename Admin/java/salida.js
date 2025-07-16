
    // MENÚ dinámico por rol
    window.addEventListener('DOMContentLoaded', () => {
      const rol = sessionStorage.getItem("rol");
      const menu = document.getElementById("menuNav");
      const lista = document.getElementById("menuOpciones");

      if (!rol || !menu || !lista) {
        window.location.href = "index.html";
        return;
      }

      menu.style.display = "flex";

      if (rol === "admin") {
        lista.innerHTML = `
          <li><a href="productos_manager.html">Gestión</a></li>
          <li><a href="tienda.html">Tienda</a></li>
          <li><a href="info.html">Información</a></li>
          <li><a href="historialentrada.html">Entradas</a></li>
          <li><a href="historialsalida.html">Salidas</a></li>
          <li><a href="cuenta.html">Cerrar sesión</a></li>
        `;
      } else if (rol === "angelo") {
        lista.innerHTML = `
          <li><a href="tienda.html">Tienda</a></li>
          <li><a href="productos.html">Catálogo</a></li>
          <li><a href="info.html">Información</a></li>
        `;
      } else {
        window.location.href = "index.html";
      }
    });

    // FIREBASE CONFIG
    const firebaseConfig = {
      apiKey: "TU_API_KEY",
      authDomain: "kiark-12902.firebaseapp.com",
      databaseURL: "https://kiark-12902-default-rtdb.firebaseio.com/",
      projectId: "kiark-12902",
      storageBucket: "kiark-12902.appspot.com",
      messagingSenderId: "TU_MESSAGING_SENDER_ID",
      appId: "TU_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const tablaBody = document.querySelector('#tabla-salidas tbody');
    const totalVendidoTexto = document.getElementById('total-vendido');

    db.ref('historial').once('value').then((snapshot) => {
      let totalVendido = 0;
      const movimientos = [];

      snapshot.forEach(child => {
        const h = child.val();
        if (h.tipo !== "salida") return;

        const cantidad = parseInt(h.cantidad) || 0;
        const precio = parseFloat(h.precioUnitario);
        const total = !isNaN(precio) ? cantidad * precio : 0;

        totalVendido += total;

        movimientos.push({
          fecha: h.fecha,
          producto: h.productoId,
          cantidad,
          precio,
          total
        });
      });

      movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      movimientos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${m.fecha}</td>
          <td>${m.producto}</td>
          <td>${m.cantidad}</td>
          <td>S/ ${m.precio.toFixed(2)}</td>
          <td><strong>S/ ${m.total.toFixed(2)}</strong></td>
        `;
        tablaBody.appendChild(fila);
      });

      totalVendidoTexto.textContent = `Total vendido: S/ ${totalVendido.toFixed(2)}`;
    });

    function limpiarSalidas() {
      if (confirm("¿Estás seguro de eliminar todos los registros de salida?")) {
        db.ref('historial').once('value').then(snapshot => {
          snapshot.forEach(child => {
            const movimiento = child.val();
            if (movimiento.tipo === "salida") {
              db.ref('historial/' + child.key).remove();
            }
          });
          alert("Todos los registros de salida fueron eliminados.");
          location.reload();
        });
      }
    }
  