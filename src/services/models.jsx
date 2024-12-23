import dayjs from "dayjs";
import {
    collection,
    endAt,
    getDocs as getDocsFromDb,
    getDocs,
    limit,
    orderBy,
    query,
    startAt,
    where
} from "firebase/firestore";
import {db} from "../firebase";
import {COLLECTIONS} from "../constants/collections";

export const getModelsByAge = async (age) => {
    // Calculate birthdate range for users with the given age
    const birthdateThisYear = dayjs().subtract(age, 'year').startOf('day').unix();
    const birthdateLastYear = dayjs().subtract(age + 1, 'year').startOf('day').unix();

    // Query Firestore for users with birthdates in the specified range
    const q = query(
        collection(db, COLLECTIONS.models),
        where('birthday', '>=', birthdateLastYear),
        where('birthday', '<', birthdateThisYear)
    );

    const response = await getDocs(q);

    // Filter users whose age matches the input value
    const users = response.docs
        .map((doc) => ({...doc.data(), id: doc.id}))
        .filter((user) => {
            const birthday = dayjs.unix(user.birthday);
            const nextBirthday = birthday.add(age + 1, 'year');
            const ageDiff = dayjs().diff(nextBirthday, 'year');
            return ageDiff === 0;
        });

    return users;
};

export const getModels = async (requestedOrderBy, requestedQuery, isActive, showMore) => {
    const q = query(
        collection(db, COLLECTIONS.models),
        where("isActive", "==", isActive),
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