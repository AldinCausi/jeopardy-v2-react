// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfd8tDlbQKrDUGzNGmmpozxHzGowjlYWs",
  authDomain: "jeopardy-react-d586c.firebaseapp.com",
  projectId: "jeopardy-react-d586c",
  storageBucket: "jeopardy-react-d586c.firebasestorage.app",
  messagingSenderId: "383507806852",
  appId: "1:383507806852:web:226696863b39766d1b20d1",
  measurementId: "G-49CWBR16HX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
