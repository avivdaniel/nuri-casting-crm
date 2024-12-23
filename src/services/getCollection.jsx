import {db} from "../firebase";
import dayjs from "dayjs";
import {
    collection,
    query,
    orderBy,
    endAt,
    startAt,
    getDocs as getDocsFromDb
} from "firebase/firestore";
import {formatDocs} from "./formatDocs";

export const getCollectionByDateRange = async (collectionName, startDate, endDate, order='createdDate') => {
    const q = query(
        collection(db, collectionName),
        orderBy(order),
        startAt(dayjs(startDate).valueOf()),
        endAt(dayjs(endDate).valueOf()),
    );

    const querySnapshot = await getDocsFromDb(q);
    return formatDocs(querySnapshot)
}
