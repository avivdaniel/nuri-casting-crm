import dayjs from "dayjs";
import {putDocumentOnStorage, deleteDocument} from "./documents";
import {COLLECTIONS} from "../constants/collections";

export const formatTaskForStorage = (task) => {
    return {
        ...task,
        deadline: dayjs(task.deadline).valueOf()
    }
}

export const putTaskDocumentOnStorage = (taskId, document) => {
    return putDocumentOnStorage(COLLECTIONS.tasks, taskId, document);
};

export const deleteTaskDocument = (taskId, document) => {
    return deleteDocument(COLLECTIONS.tasks, taskId, document);
};
