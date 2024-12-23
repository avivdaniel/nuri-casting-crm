import {collection, doc, getDocs} from "firebase/firestore";
import {db} from "../firebase";

export const getDocSubCollection = async (collectionName, subCollection, docId) => {
    const docRef = doc(db, collectionName, docId);
    const docSubCollectionRef = collection(docRef, subCollection);
    const documentsSnap = await getDocs(docSubCollectionRef);
    return documentsSnap.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
};