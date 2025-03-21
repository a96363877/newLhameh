import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCSfGNooCNVcSbPFBsWxcHqq0Ndu2QKg0",
  authDomain: "project-6099988003803070605.firebaseapp.com",
  projectId: "project-6099988003803070605",
  storageBucket: "project-6099988003803070605.firebasestorage.app",
  messagingSenderId: "5321189472",
  appId: "1:5321189472:web:cd09cecd0bfe5675407b05",
  measurementId: "G-J54JNJ2V6R"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

