import {db} from "../firebase";
import {doc, getDoc as getDocFromDb} from "firebase/firestore"

export const getDoc = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDocFromDb(docRef);
    if (docSnap.exists()) {
        const doc = docSnap.data()
        return {...doc, id: docId};
    } else {
        return null;
    }
};
