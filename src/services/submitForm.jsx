import { updateDoc, addDoc } from "./index";

export const submitForm = async (history, collection, docId, doc) => {
  if (docId) {
    await updateDoc(collection, docId, doc);
    window.location.reload();
  } else {
    const docRef = await addDoc(collection, doc);
    history.push(`admin/${collection}/${docRef.id}`);
  }
};
