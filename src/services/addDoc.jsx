import {db} from "../firebase";
import {collection, addDoc as addDocToDb} from "firebase/firestore"

export const addDoc = async (collectionName, doc) => {
    const docRef = await addDocToDb(collection(db, collectionName), doc);
    return docRef;
};
