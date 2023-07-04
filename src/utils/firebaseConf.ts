// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCihd1tS6TH-t71JIL9glp1hmlqXSmXPnU",
  authDomain: "saw-prova.firebaseapp.com",
  databaseURL: "https://saw-prova-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "saw-prova",
  storageBucket: "saw-prova.appspot.com",
  messagingSenderId: "102794337429",
  appId: "1:102794337429:web:1b588c2aeba8748d5e8f9c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);