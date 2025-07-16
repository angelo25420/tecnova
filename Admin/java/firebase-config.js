// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY", // ← pon aquí tu API KEY real
  authDomain: "kiark-12902.firebaseapp.com",
  databaseURL: "https://kiark-12902-default-rtdb.firebaseio.com/",
  projectId: "kiark-12902",
  storageBucket: "kiark-12902.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID", // ← también tu ID real
  appId: "TU_APP_ID" // ← también tu APP ID real
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Realtime Database
const db = firebase.database();

// Si vas a subir archivos (opcional)
const storage = firebase.storage();
