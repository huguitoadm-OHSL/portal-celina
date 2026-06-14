import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tus llaves maestras de PortalCelinaBD
const firebaseConfig = {
  apiKey: "AIzaSyC9AF4t-koCVpATa8sxaFGOzvN28x8XCiM",
  authDomain: "portalcelinabd.firebaseapp.com",
  projectId: "portalcelinabd",
  storageBucket: "portalcelinabd.firebasestorage.app",
  messagingSenderId: "684004736221",
  appId: "1:684004736221:web:ea129efc2220eccbb72f34"
};

// Inicializamos la Nube y la Base de Datos
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
