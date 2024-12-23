import React, {useContext, useEffect, useState} from 'react';
import {deleteTransactionAndDoc, getSalariesForModel} from "../../../../services/salaries.jsx";
import {useModelDetailsContext} from "../../../../context/ModelDetailsContext.jsx";
import {TabsRenderer} from "./TabsRenderer.jsx";

const SalaryContext = React.createContext({});

const SalaryContextProvider = ({children}) => {
    const [salaries, setSalaries] = useState([]);
    const [loadingSalary, setLoadingSalary] = useState(false);
    const {model} = useModelDetailsContext();

    const getYearlySalaries = async () => {
        if (!model.id) return;
        try {
            setLoadingSalary(true);
            const res = await getSalariesForModel(model.id)
            setSalaries(res);
            setLoadingSalary(false);
        } catch (e) {
            alert(e)
            setLoadingSalary(false);
            setSalaries([])
        }
    };

    const deleteTransaction = async (transactionId) => {
        setLoadingSalary(true)
        try {
            await deleteTransactionAndDoc(transactionId);
            await getYearlySalaries();
            setLoadingSalary(false);
        } catch (e) {
            alert(e)
            setLoadingSalary(false);
        }
    }

    useEffect(() => {
        (async ()=> await getYearlySalaries())();
    }, []);

    return <SalaryContext.Provider
        value={{
            salaries,
            setSalaries,
            loadingSalary,
            setLoadingSalary,
            getYearlySalaries,
            deleteTransaction,
        }}>
        {children}
    </SalaryContext.Provider>
}

export const useSalaryContext = () => useContext(SalaryContext);

export const ModelSalary = () => {

    return (
        <SalaryContextProvider>
            <TabsRenderer/>
        </SalaryContextProvider>
    );
};