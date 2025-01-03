import React, { useContext, useState, useCallback } from 'react';
import { deleteDoc, getDoc, updateDoc } from "../services";
import { useHistory } from "react-router-dom";
import { COLLECTIONS } from "../constants/collections";

const ModelDetailsContext = React.createContext({});

export const ModelDetailsContextProvider = ({ children }) => {
    const [model, setModel] = useState(null);
    const [loadingModel, setLoadingModel] = useState(false);
    const history = useHistory();

    const getModel = useCallback(async (modelId) => {
        if (!modelId) return;
        setLoadingModel(true);
        try {
            const model = await getDoc(COLLECTIONS.models, modelId);
            setModel(model);
        } catch (err) {
            console.error(err);
            // alert(err);
            // history.push("/admin");
        } finally {
            setLoadingModel(false);
        }
    }, [history]);

    const updateModel = useCallback(async (modelId, modelData) => {
        if (!modelId) return;
        setLoadingModel(true);
        try {
            await updateDoc(COLLECTIONS.models, modelId, modelData);
            await getModel(modelId);
        } catch (e) {
            alert(e);
        } finally {
            setLoadingModel(false);
        }
    }, [getModel]);

    const deleteModel = useCallback(async (modelId) => {
        if (window.confirm("למחוק את המיוצג?")) {
            setLoadingModel(true);
            try {
                await deleteDoc(COLLECTIONS.models, modelId);
                history.push("/admin/models");
            } catch (err) {
                alert(err);
            } finally {
                setLoadingModel(false);
            }
        }
    }, [history]);

    const api = { getModel, deleteModel, updateModel };

    const contextValue = { api, model, setModel, loadingModel };

    return (
        <ModelDetailsContext.Provider value={contextValue}>
            {children}
        </ModelDetailsContext.Provider>
    );
};

export const useModelDetailsContext = () => useContext(ModelDetailsContext);
