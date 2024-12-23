import {db} from "../firebase";
import {collection, orderBy, query, where, startAfter, limit, getDocs} from "firebase/firestore";
import {COLLECTIONS} from "../constants/collections";

export const PAGINATION_ACTIONS = {
    next: 'NEXT',
    previous: 'PREVIUS'
}

export const fetchPaginatedData = async (entityObject) => {
    const {
        collection: collectionName,
        records_limit,
        pageAction,
        page,
        orderByField,
        orderByOrder,
        whereFields,
        lastIndex: afterThis,
    } = entityObject

    const collectionRef = collection(db, COLLECTIONS[collectionName]);
    let queryRef = query(collectionRef);

    if (page > 1) {
        if (pageAction === PAGINATION_ACTIONS.next) {
            queryRef = query(collectionRef, orderBy(orderByField, orderByOrder), startAfter(afterThis), limit(records_limit))
        }
    } else {
        queryRef = query(queryRef, orderBy(orderByField, orderByOrder), limit(records_limit));
    }

    if (whereFields && !!whereFields?.length) {
        whereFields.forEach(whereObj => {
            queryRef = query(queryRef, where(whereObj.name, whereObj.operator, whereObj.value))
        })
    }

    //FETCH HERE
    const querySnapshot = await getDocs(queryRef);
    return querySnapshot?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
}