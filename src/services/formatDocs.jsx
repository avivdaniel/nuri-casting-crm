export const formatDocs = (querySnapshot) => {
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data()?.date?.toDate(),
        id: doc.id,
    }));
}
