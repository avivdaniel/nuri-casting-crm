import {ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../firebase";

export const addFile = (fileName, file) => {
    const storageRef = ref(storage, fileName)
    uploadBytesResumable(storageRef, file);
    return storageRef;
}