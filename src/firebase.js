import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlcLXLmG_wmkuTzlQpA-23SgX0YzLDzXI",
  authDomain: "kitees-1011.firebaseapp.com",
  projectId: "kitees-1011",
  storageBucket: "kitees-1011.firebasestorage.app",
  messagingSenderId: "314935450987",
  appId: "1:314935450987:web:c8da32b22e484ff2e7c02e",
  measurementId: "G-T5B4TV9L08",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
