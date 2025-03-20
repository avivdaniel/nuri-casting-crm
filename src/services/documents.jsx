import {v4} from "uuid";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, deleteDoc, doc} from "firebase/firestore";
import {db, storage} from "../firebase";

const generateDocumentPathName = (collectionName, parentId, documentName) => {
    if (!parentId) return;
    return `${collectionName}/${parentId}/${v4() + documentName}`;
};

const putDocRefInSubCollection = async (collectionName, parentId, fileName, description, downloadUrl) => {
    if (!parentId) return;
    const parentRef = doc(db, collectionName, parentId);
    const documentsSubCollectionRef = collection(parentRef, "documents");
    await addDoc(documentsSubCollectionRef, {
        date: Date.now(),
        url: downloadUrl,
        description,
        fileName
    });
};

export const putDocumentOnStorage = async (collectionName, parentId, document) => {
    const documentName = generateDocumentPathName(collectionName, parentId, document.name);
    const storageRef = ref(storage, documentName);
    const documentSnapshot = await uploadBytes(storageRef, document);
    const downloadUrl = await getDownloadURL(documentSnapshot.ref);
    await putDocRefInSubCollection(collectionName, parentId, documentName, document.name, downloadUrl);
};

export const deleteDocument = async (collectionName, parentId, document) => {
    if (!parentId || !document.id) return;
    if (window.confirm("למחוק את המסמך?")) {
        // Delete the doc from the document sub collection
        await deleteDoc(doc(db, collectionName, parentId, "documents", document.id));
        // Delete the doc from the storage
        const documentRef = ref(storage, document.fileName);
        await deleteObject(documentRef);
    }
}; 