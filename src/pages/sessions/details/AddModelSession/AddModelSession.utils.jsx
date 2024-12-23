import {getModelSessionsForModel} from "../../../../services/index.jsx";
import dayjs from "dayjs";

export const checkModelSessionConflicts = async ({modelId, currentSession}) => {
    const modelScheduledSessions = await getModelSessionsForModel(modelId);
    const currentSessionFormattedDate = dayjs(currentSession.date).format("DD/MM/YYYY");

    const conflictingSessions = modelScheduledSessions.filter(({session: plannedSession}) => {
        const plannedSessionFormattedDate = dayjs(plannedSession.date.toDate()).format("DD/MM/YYYY");
        return plannedSessionFormattedDate === currentSessionFormattedDate;
    });

    return conflictingSessions;
};

export const generateNewModelSession = ({modelId, currentSession}) => ({
    sessionId: currentSession.id,
    modelId,
    payment: currentSession?.paymentPerModel || 0,
    hasTransportation: "ללא",
    note: "",
    commission: "",
    hasFine: false
});