import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {} from 'firebase/auth';
import {} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyClFLzpsO6igh1FAsxPaYYoRwPNajUcsUY',
	authDomain: 'ecom-app-95c8d.firebaseapp.com',
	projectId: 'ecom-app-95c8d',
	storageBucket: 'ecom-app-95c8d.firebasestorage.app',
	messagingSenderId: '229995868392',
	appId: '1:229995868392:web:2430caf239c3a5a65c995d',
	measurementId: 'G-4M7YCLN9XX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createApp(App).use(router).mount('#app');

console.log(app);
