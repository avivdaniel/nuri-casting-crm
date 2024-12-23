import { db } from "../firebase";
import {doc, updateDoc as updateDocOnDb} from "firebase/firestore"

export const updateDoc = async (collectionName, docId, docData) => {
  const docToUpdate = doc(db, collectionName, docId)
  const updatedDoc = await updateDocOnDb(docToUpdate, docData)
  return updatedDoc;
};