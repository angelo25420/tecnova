
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
      const catalogo = document.getElementById("catalogo");

      function mostrarAnimacion() {
        const anim = document.getElementById("compraExitosa");
        anim.classList.add("active");
        setTimeout(() => anim.classList.remove("active"), 2000);
      }

      db.ref("productos")
        .once("value")
        .then((snapshot) => {
          if (!snapshot.exists()) {
            catalogo.innerHTML =
              '<p style="text-align:center;">No hay productos disponibles.</p>';
            return;
          }

          snapshot.forEach((child) => {
            const id = child.key;
            const p = child.val();
            const card = document.createElement("div");
            card.className = "producto";

            card.innerHTML = `
          <img src="${p.imagenUrl || "https://via.placeholder.com/200"}" alt="${
              p.nombre
            }">
          <h3>${p.nombre}</h3>
          <p>Marca: ${p.marca || "Desconocida"}</p>
          <p>Precio: S/ ${p.precio}</p>
          <p>Stock disponible: ${p.cantidad}</p>
          <input type="number" id="cantidad-${id}" min="1" max="${
              p.cantidad
            }" placeholder="Cantidad" value="1">
          <button onclick="comprar('${id}', '${p.nombre}', ${p.precio}, ${
              p.cantidad
            })">Comprar</button>
        `;

            catalogo.appendChild(card);
          });
        });

      function comprar(id, nombre, precio, stock) {
        const input = document.getElementById(`cantidad-${id}`);
        const cantidad = parseInt(input.value);

        if (isNaN(cantidad) || cantidad <= 0) {
          alert("⚠️ Ingresa una cantidad válida.");
          return;
        }

        if (cantidad > stock) {
          alert("❌ No puedes comprar más de lo disponible en stock.");
          return;
        }

        const nuevoStock = stock - cantidad;
        db.ref(`productos/${id}/cantidad`).set(nuevoStock);

        const movimiento = {
          tipo: "salida",
          productoId: nombre,
          cantidad,
          precioUnitario: precio,
          total: cantidad * precio,
          fecha: new Date().toLocaleString(),
        };

        db.ref("historial").push(movimiento);

        mostrarAnimacion();
        setTimeout(() => window.location.reload(), 1000);
      }
    