
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

    const tablaBody = document.querySelector('#tabla-entradas tbody');
    const totalEntradasTexto = document.getElementById('total-entradas');

    db.ref('historial').once('value').then((snapshot) => {
      let totalEntradas = 0;
      const entradasPorProducto = {};
      const fechasEdicionPorProducto = {};

      snapshot.forEach(child => {
        const h = child.val();

        if (h.tipo === "entrada") {
          const id = h.productoId;
          if (!entradasPorProducto[id]) entradasPorProducto[id] = [];
          entradasPorProducto[id].push(h);
        } else if (h.tipo === "edicion") {
          const id = h.productoId;
          const fechaEdicion = new Date(h.fecha);
          if (!fechasEdicionPorProducto[id]) fechasEdicionPorProducto[id] = [];
          fechasEdicionPorProducto[id].push(fechaEdicion);
        }
      });

      const movimientos = [];

      for (const productoId in entradasPorProducto) {
        const entradas = entradasPorProducto[productoId];
        entradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const entradaMasReciente = entradas[0];

        const cantidad = parseInt(entradaMasReciente.cantidad) || 0;
        const precio = parseFloat(entradaMasReciente.precioUnitario);
        const total = !isNaN(precio) ? cantidad * precio : 0;
        totalEntradas += total;

        const fechaEntrada = new Date(entradaMasReciente.fecha);
        const ediciones = fechasEdicionPorProducto[productoId] || [];
        const fueEditado = ediciones.some(f => f >= fechaEntrada);

        movimientos.push({
          fecha: entradaMasReciente.fecha,
          producto: productoId,
          cantidad,
          precio,
          total,
          editado: fueEditado
        });
      }

      movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      movimientos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${m.fecha}</td>
          <td>${m.producto}</td>
          <td>${m.cantidad}</td>
          <td>S/ ${m.precio.toFixed(2)}</td>
          <td><strong>S/ ${m.total.toFixed(2)}</strong></td>
          <td>${m.editado ? '<span class="editado">Editado</span>' : '—'}</td>
        `;
        tablaBody.appendChild(fila);
      });

      totalEntradasTexto.textContent = `Total ingresado: S/ ${totalEntradas.toFixed(2)}`;
    });

    function limpiarEntradas() {
      if (confirm("¿Seguro que deseas eliminar todos los registros de entrada?")) {
        db.ref('historial').once('value').then(snapshot => {
          snapshot.forEach(child => {
            const movimiento = child.val();
            if (movimiento.tipo === "entrada") {
              db.ref('historial/' + child.key).remove();
            }
          });
          alert("Registros de entrada eliminados correctamente.");
          location.reload();
        });
      }
    }
  