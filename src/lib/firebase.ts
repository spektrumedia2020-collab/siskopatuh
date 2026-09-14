import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDk5aQjCokx7oeDuGXrpzYnDGHVy7eE6co",
  authDomain: "gen-lang-client-0696981370.firebaseapp.com",
  projectId: "gen-lang-client-0696981370",
  storageBucket: "gen-lang-client-0696981370.firebasestorage.app",
  messagingSenderId: "290624513848",
  appId: "1:290624513848:web:38a1c9222cd815d64303cd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");
