import {
    doc,
    deleteDoc as deleteDocFromDb,
} from "firebase/firestore";
import {db, storage} from "../firebase";
import {COLLECTIONS} from "../constants/collections";
import {getDocsWhere} from "./getDocs";
import {deleteObject, ref} from "firebase/storage";
import {getDocSubCollection} from "./getDocSubCollection";
import {mapAsync} from "./mapAsync";

const deleteSalariesForModel = async (modelId) => {
    if (!modelId) return;
    const salariesSnap = await getDocsWhere(COLLECTIONS.salaries, 'modelId', '==', modelId);
    salariesSnap.forEach(async (salary) => {
        await deleteDocFromDb(doc(db, COLLECTIONS.salaries, salary.id));
    });
};

const deleteSalariesTransactionsForModel = async (modelId) => {
    if (!modelId) return;
    const transactionsSnap = await getDocsWhere(COLLECTIONS.salariesTransactions, 'modelId', '==', modelId)
    transactionsSnap.forEach(async (transaction) => {
        await deleteDocFromDb(doc(db, COLLECTIONS.salariesTransactions, transaction.id));
    });
};

const deleteModelSessionsForModel = async (modelId) => {
    if (!modelId) return;
    const modelSessionsSnap = await getDocsWhere(COLLECTIONS.modelSessions, 'modelId', '==', modelId)
    modelSessionsSnap.forEach(async (modelSession) => {
        await deleteDocFromDb(doc(db, COLLECTIONS.modelSessions, modelSession.id));
    });
};

const deleteModelSessionsForSession = async (sessionId) => {
    if (!sessionId) return;
    const modelSessionsSnap = await getDocsWhere(COLLECTIONS.modelSessions, 'sessionId', '==', sessionId)
    modelSessionsSnap.forEach(async (modelSession) => {
        await deleteDocFromDb(doc(db, COLLECTIONS.modelSessions, modelSession.id));
    });
};

const deleteDocumentsForTask = async (taskId) => {
    if (!taskId) return;
    const tasksDocuments = await getDocSubCollection(COLLECTIONS.tasks, 'documents', taskId);
    // Delete Doc from Firebase Storage
    await mapAsync(tasksDocuments, async ({fileName})=> {
        const taskDocRef = ref(storage, fileName);
        await deleteObject(taskDocRef).catch(() => console.error('No model profile image to delete for this model.'))
    });
    // Delete Documents Sub-Collection
    await mapAsync(tasksDocuments, async ({id: documentId}) => {
        await deleteDocFromDb(doc(db, COLLECTIONS.tasks, taskId, "documents", documentId ))
    });
}

export const deleteDoc = async (collectionName, docId) => {
    await deleteDocFromDb(doc(db, collectionName, docId));

    if (collectionName === COLLECTIONS.tasks) {
        await deleteDocumentsForTask(docId)
    }

    if (collectionName === COLLECTIONS.sessions) {
        await deleteModelSessionsForSession(docId)
    }

    if (collectionName === COLLECTIONS.models) {
        await deleteSalariesForModel(docId);
        await deleteSalariesTransactionsForModel(docId);
        await deleteModelSessionsForModel(docId)
        // Delete the model profile image
        const modelProfileImageRef = ref(storage, docId + ".jpg");
        await deleteObject(modelProfileImageRef).catch(() => console.error('No model profile image to delete for this model.'))
    }
};
