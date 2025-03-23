import { initializeApp } from "firebase/app"
import { doc, getFirestore, setDoc } from "firebase/firestore"
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