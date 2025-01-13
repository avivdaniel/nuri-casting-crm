import {useState} from 'react';
import {useHistory} from "react-router-dom";
import {addDoc, getDocsWhere} from "../../services";
import {COLLECTIONS} from "../../constants/collections";

const useDuplicateSession = ({originalSession}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(null);
    const history = useHistory();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const duplicateSession = async () => {
        if (!originalSession) return;
        try {
            const docRef = await addDoc(COLLECTIONS.sessions, {
                date,
                createdDate: Date.now(),
                production: originalSession.production
            });
            return docRef;
        } catch (err) {
            alert(err);
        }
    };

    const getAndFormatModelSessions = async (duplicatedSessionId) => {
        const originalModelSessions = await getDocsWhere(COLLECTIONS.modelSessions, "sessionId", "==", originalSession.id)
        const formattedModelSessions = originalModelSessions.map((doc) => ({
            ...doc,
            sessionId: duplicatedSessionId,
        }));
        return formattedModelSessions;
    }
    const duplicateModelSessions = async (duplicatedSessionId) => {
        if (!originalSession.id || !duplicatedSessionId) return;
        try {
            const modelSessions = await getAndFormatModelSessions(duplicatedSessionId);
            await Promise.all(modelSessions?.map(async (modelSession) => {
                return await addDoc(COLLECTIONS.modelSessions, modelSession);
            }));
        } catch (e) {
            alert(e);
        }

    };

    const onSubmit = async () => {
        if (!date) return;
        setIsLoading(true);
        try {
            const duplicatedSessionRef = await duplicateSession();
            await duplicateModelSessions(duplicatedSessionRef.id);
            alert('יום הצילום שוכפל בהצלחה');
            closeModal();
            history.push(`/admin/sessions/${duplicatedSessionRef.id}`);
        } catch (e) {
            alert(e)
        }
        setIsLoading(false);
    }

    return {isOpen, isLoading, openModal, closeModal, onSubmit, setDate, date};
};

export default useDuplicateSession;