import { initializeApp } from "firebase/app"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA29jisytpjRzNnN6eOuPs3bj5zKXrssLM",
  authDomain: "qrmenu-a.firebaseapp.com",
  projectId: "qrmenu-a",
  storageBucket: "qrmenu-a.firebasestorage.app",
  messagingSenderId: "37706816704",
  appId: "1:37706816704:web:c673ecd57b9de36d2e6125",
  measurementId: "G-K35X7L62P1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const database = getDatabase(app)


export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);
  try {
    const docRef = await doc(db, 'pays', data.id!);
    await setDoc(docRef, {createdDate:new Date().toISOString(),...data}, { merge: true }
    );

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
  }
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' ,createdDate:new Date().toISOString()},
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};