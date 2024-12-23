import {db} from "../firebase";
import {collection, endAt, getDocs as getDocsFromDb, limit, orderBy, query, startAt, where} from "firebase/firestore";

export const getDocs = async (collectionName, requestedOrderBy, requestedQuery, showMore) => {

    const q = query(
        collection(db, collectionName),
        orderBy(requestedOrderBy),
        startAt(requestedQuery),
        endAt(requestedQuery + "\uf8ff"),
        limit(1 * showMore)
    );

    const response = await getDocsFromDb(q);
    return response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
};

/**
 * Retrieves documents from a Cloud Firestore collection using a where clause.
 *
 * @param {string} collectionName - The name of the collection to query.
 * @param {string} field - The field to filter on.
 * @param {string} operator - The operator to use for the filter (e.g. "==", "<", ">", etc.).
 * @param {any} value - The value to filter the field by.
 * @returns {Array} An array of documents from the collection that match the where clause.
 */

export const getDocsWhere = async (collectionName, field, operator, value) => {

    const q = query(
        collection(db, collectionName),
        where(field, operator, value)
    );

    const response = await getDocsFromDb(q);
    return response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
};

/**
 * Retrieves documents from a Cloud Firestore collection using multiple where clauses and optional ordering.
 *
 * @param {string} collectionName - The name of the collection to query.
 * @param {Array} conditions - An array of objects representing the where conditions.
 * @param {string} conditions[].field - The field to filter on.
 * @param {string} conditions[].operator - The operator to use for the filter (e.g., "==", "<", ">", etc.).
 * @param {any} conditions[].value - The value to filter the field by.
 * @param {Array} [orderByFields] - An optional array of objects specifying the fields to order by.
 * @param {string} orderByFields[].field - The field to order by.
 * @param {string} [orderByFields[].direction='asc'] - The direction to order by ('asc' or 'desc').
 * @param {number} [maxLimit] - An optional limit for the number of documents to retrieve.
 * @returns {Array} An array of documents from the collection that match the where clauses.
 */
export const getDocsWhereMultiple = async (collectionName, conditions, orderByFields = [], maxLimit) => {
    // Build the query dynamically based on conditions
    let q = collection(db, collectionName);

    // Add where conditions
    conditions.forEach(({field, operator, value}) => {
        q = query(q, where(field, operator, value));
    });

    // Add order by conditions if provided
    orderByFields.forEach(({field, direction = 'asc'}) => {
        q = query(q, orderBy(field, direction));
    });

    // Add limit if provided
    if (limit) {
        q = query(q, limit(maxLimit));
    }

    const response = await getDocsFromDb(q);

    // Map the documents to an array
    return response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
};