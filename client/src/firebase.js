import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOlQoxFFoIr89xrz5afwT_RYBXU8zGJPA",
  authDomain: "trendzilla-fbadf.firebaseapp.com",
  projectId: "trendzilla-fbadf",
  storageBucket: "trendzilla-fbadf.appspot.com",
  messagingSenderId: "386914787618",
  appId: "1:386914787618:web:293d2784ebead6afc5057b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, query, where, getDocs };
