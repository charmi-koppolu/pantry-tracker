// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiCeFCcsR0Fr5cx-np8z6AvNtglP-XiDk",
  authDomain: "inventory-management-f9d1d.firebaseapp.com",
  projectId: "inventory-management-f9d1d",
  storageBucket: "inventory-management-f9d1d.appspot.com",
  messagingSenderId: "649075436674",
  appId: "1:649075436674:web:764f850d613e40477bd89b",
  measurementId: "G-MXPGP3F87E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};