// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFKBm38hHwGixLQqb5GQriks7-V0CQrU8",
  authDomain: "yomiage-maker.firebaseapp.com",
  projectId: "yomiage-maker",
  storageBucket: "yomiage-maker.appspot.com",
  messagingSenderId: "251485210092",
  appId: "1:251485210092:web:335b8643bc12ca3e9a2cc9",
  measurementId: "G-BELL7EJ87K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export default db;