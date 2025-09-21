
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAaUrGHbxE8IpYPM03G_SF_rHubjZO0sjE",
  authDomain: "bamboohome-7bddf.firebaseapp.com",
  projectId: "bamboohome-7bddf",
  storageBucket: "bamboohome-7bddf.firebasestorage.app",
  messagingSenderId: "225419682720",
  appId: "1:225419682720:web:39bb159fb5547f40c03ac5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)