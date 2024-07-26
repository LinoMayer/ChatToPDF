import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBx-XFTx4LtsX9956iD_sADA3bLuVPieB8",
    authDomain: "chat-with-pdf-b9485.firebaseapp.com",
    projectId: "chat-with-pdf-b9485",
    storageBucket: "chat-with-pdf-b9485.appspot.com",
    messagingSenderId: "312161855507",
    appId: "1:312161855507:web:a354d2bd10a8c12fdd37e6",
    measurementId: "G-2FMH8R1NMQ"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore(app);
  const storage = getStorage(app);

  export { db, storage };

