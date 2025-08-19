//$npm install firebase;
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDcCVGLEUYh2FlSvwhCOZaL2iqp4NNSIvY',
	authDomain: 'online-marketplace-c588e.firebaseapp.com',
	projectId: 'online-marketplace-c588e',
	storageBucket: 'online-marketplace-c588e.firebasestorage.app',
	messagingSenderId: '1046246503863',
	appId: '1:1046246503863:web:ba28319da7126a4d06e432',
	measurementId: 'G-9TM0SQJWLT',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 🔁 Export all required Firebase functions for server-side use
export {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	doc,
	getDoc,
	setDoc,
};
