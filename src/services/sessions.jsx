import {getDocsWhereMultiple} from "./getDocs";
import {COLLECTIONS} from "../constants/collections";

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