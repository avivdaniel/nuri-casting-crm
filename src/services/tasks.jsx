import dayjs from "dayjs";
import {v4} from "uuid";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, deleteDoc, doc} from "firebase/firestore";
import {db, storage} from "../firebase";
import {COLLECTIONS} from "../constants/collections";

export const formatTaskForStorage = (task) => {
    return {
        ...task,
        deadline: dayjs(task.deadline).valueOf()
    }
}

const generateTaskDocumentPathName = (taskId, documentName) => {
    if (!taskId) return;
    return `tasks/${taskId}/${v4() + documentName}`
};

const putDocRefInSubCollection = async (taskId, fileName, description, downloadUrl) => {
    if (!taskId) return;
    const taskRef = doc(db, COLLECTIONS.tasks, taskId)
    const taskDocumentsSubCollectionRef = collection(taskRef, "documents")
    await addDoc(taskDocumentsSubCollectionRef, {
        date: Date.now(),
        url: downloadUrl,
        description,
        fileName
    })
}
export const putTaskDocumentOnStorage = async (taskId, document) => {
    const documentName = generateTaskDocumentPathName(taskId, document.name)
    const storageRef = ref(storage, documentName);
    const documentSnapshot = await uploadBytes(storageRef, document)
    const downloadUrl = await getDownloadURL(documentSnapshot.ref);
    await putDocRefInSubCollection(taskId, documentName, document.name, downloadUrl)
};

export const deleteTaskDocument = async (taskId, document) => {
    if (!taskId || !document.id) return;
    if (window.confirm("למחוק את המסמך?")) {
        // Delete the doc from the document sub collection
        await deleteDoc(doc(db, COLLECTIONS.tasks, taskId, "documents", document.id))
        // Delete the doc from the storage
        const documentRef = ref(storage, document.fileName);
        await deleteObject(documentRef)
    }
}
