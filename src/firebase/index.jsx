import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
