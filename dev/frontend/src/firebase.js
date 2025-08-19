import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyClFLzpsO6igh1FAsxPaYYoRwPNajUcsUY',
	authDomain: 'ecom-app-95c8d.firebaseapp.com',
	projectId: 'ecom-app-95c8d',
	storageBucket: 'ecom-app-95c8d.firebasestorage.app',
	messagingSenderId: '229995868392',
	appId: '1:229995868392:web:2430caf239c3a5a65c995d',
	measurementId: 'G-4M7YCLN9XX',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔁 Export all required Firebase functions for server-side use
export {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	doc,
	getDoc,
	setDoc,
};
