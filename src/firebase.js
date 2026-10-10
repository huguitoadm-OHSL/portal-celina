import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración pública de Firebase. La autorización se verifica con Auth y reglas del servidor.
const firebaseConfig = {
  apiKey: "AIzaSyC9AF4t-koCVpATa8sxaFGOzvN28x8XCiM",
  authDomain: "portalcelinabd.firebaseapp.com",
  projectId: "portalcelinabd",
  storageBucket: "portalcelinabd.firebasestorage.app",
  messagingSenderId: "684004736221",
  appId: "1:684004736221:web:ea129efc2220eccbb72f34"
};

// Inicializar Auth. No existe una conexión de ventas ni escrituras en Firestore.
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
