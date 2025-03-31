import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB1kcPtJ07ylci9clrbDRlQ33hWTJgFblc",
  authDomain: "mavcoptracker.firebaseapp.com",
  projectId: "mavcoptracker",
  storageBucket: "mavcoptracker.firebasestorage.app",
  messagingSenderId: "656016831356",
  appId: "1:656016831356:web:717ca30e0834426a976af9"
};

/*
const firebaseConfig = {
  apiKey: "AIzaSyB1kcPtJ07ylci9clrbDRlQ33hWTJgFblc",
  authDomain: "mavcoptracker.firebaseapp.com",
  projectId: "mavcoptracker",
  storageBucket: "mavcoptracker.firebasestorage.app",
  messagingSenderId: "656016831356",
  appId: "1:656016831356:web:717ca30e0834426a976af9",
  measurementId: "G-QHN05HPRRW"
};
*/


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const messaging = isSupported().then(supported => supported ? getMessaging(app) : null);

export const googleProvider = new GoogleAuthProvider();