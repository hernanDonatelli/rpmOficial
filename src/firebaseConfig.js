import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyCOHsjEwTAyX_wGbY2yOCHrgWoquSTSnn0",
  authDomain: "rpmfirebase2023.firebaseapp.com",
  projectId: "rpmfirebase2023",
  storageBucket: "rpmfirebase2023.appspot.com",
  messagingSenderId: "827249898434",
  appId: "1:827249898434:web:ab5268597bf1728266dc5b"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export { auth, db }
