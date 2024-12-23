import {mapAsync, getDoc, getDocsWhere, updateDoc} from "./index";
import {COLLECTIONS} from "../constants/collections";

export const getModelSessionsForSession = async (sessionId, populateWithModels = true) => {
    let modelSessions = await getDocsWhere(COLLECTIONS.modelSessions, "sessionId", '==', sessionId)

    if (populateWithModels) {
        const populateModelSessions = await mapAsync(
            modelSessions,
            async (modelSession) => {
                const model = await getDoc(COLLECTIONS.models, modelSession.modelId);
                return {
                    ...modelSession,
                    model,
                };
            }
        );
        modelSessions = populateModelSessions;
    }

    return modelSessions;
};

const populateModelSessions = async (modelSessions) => {
    const populateModelSessions = await mapAsync(
        modelSessions,
        async (modelSession) => {
            const session = await getDoc(COLLECTIONS.sessions, modelSession.sessionId);
            return {
                ...modelSession,
                session,
            };
        }
    );

    return populateModelSessions;
};

export const getModelSessionsForModel = async (modelId) => {
    const modelSessionsResponse = await getDocsWhere(COLLECTIONS.modelSessions, "modelId", "==", modelId)
    const modelSessions = await populateModelSessions(modelSessionsResponse);
    return modelSessions;
};

export const updateModelSession = async (updatedModelSession, modelSessionId) => {
    try {
        await updateDoc(COLLECTIONS.modelSessions, modelSessionId, updatedModelSession);
    } catch (err) {
        alert(err);
    }
};
