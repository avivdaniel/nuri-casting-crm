import {getDocsWhereMultiple} from "./getDocs";
import {COLLECTIONS} from "../constants/collections";
import {putDocumentOnStorage, deleteDocument} from "./documents";

export const fetchSessions = async (query, limit) => {
    const start = query;
    const end = query + '\uf8ff';

    const conditions = [
        {field: "production", operator: '>=', value: start},
        {field: "production", operator: '<=', value: end}
    ];

    const orderByFields = [
        {field: "production"},
        {field: "date", direction: 'desc'}
    ];

    try {
        const response = await getDocsWhereMultiple(COLLECTIONS.sessions, conditions, orderByFields, limit)
        return response.map((session) => ({
            ...session,
            date: session.date.toDate()
        }));
    } catch (e) {
        console.error(e)
        alert(e)
    }
}

export const putSessionDocumentOnStorage = (sessionId, document) => {
    return putDocumentOnStorage(COLLECTIONS.sessions, sessionId, document);
};

export const deleteSessionDocument = (sessionId, document) => {
    return deleteDocument(COLLECTIONS.sessions, sessionId, document);
};