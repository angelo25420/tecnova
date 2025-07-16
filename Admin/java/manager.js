
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

    const form = document.getElementById('formulario-producto');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const nombre = form.nombre.value.trim();
        const precio = parseFloat(form.precio.value.trim());
        const marca = form.marca.value.trim();
        const cantidad = parseInt(form.cantidad.value.trim());
        const imagenUrl = form.imagenUrl.value.trim();

        if (!nombre || isNaN(precio) || !marca || isNaN(cantidad)) {
          alert("Completa todos los campos correctamente.");
          return;
        }

        const nuevoProducto = {
          nombre,
          precio,
          marca,
          cantidad,
          fecha: new Date().toLocaleString(),
          imagenUrl: imagenUrl || ""
        };

        await db.ref('productos').push(nuevoProducto);

        const movimiento = {
          tipo: "entrada",
          productoId: nombre,
          cantidad,
          precioUnitario: precio,
          total: cantidad * precio,
          fecha: new Date().toLocaleString()
        };

        await db.ref('historial').push(movimiento);

        alert("✅ Producto agregado correctamente.");
        form.reset();
      } catch (error) {
        console.error("Error al agregar producto:", error);
        alert("❌ Ocurrió un error al agregar el producto.");
      }
    });
