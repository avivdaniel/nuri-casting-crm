import {COLLECTIONS} from "../constants/collections";
import {deleteDoc} from "./deleteDoc";
import {getDocsWhere} from "./index";
import {deleteObject, ref} from "firebase/storage";
import {storage} from "../firebase";

const isTransactionChildOfSalary = (trnx, yearlySalary) => (trnx.date >= yearlySalary.startDate) && (trnx.date <= yearlySalary.endDate);

export const getSalariesForModel = async (modelId) => {
    const modelSalaries = await getDocsWhere(COLLECTIONS.salaries, 'modelId', '==', modelId);
    const modelTransactions = await getDocsWhere(COLLECTIONS.salariesTransactions, 'modelId', '==', modelId);

    modelTransactions.forEach(trnx => {
        modelSalaries.forEach(yearlySalary => {
            if (isTransactionChildOfSalary(trnx, yearlySalary)) {
                if (!yearlySalary.transactions) {
                    yearlySalary.transactions = [];
                }
                yearlySalary.transactions.push(trnx);
            }
        })
    })

    return modelSalaries;
};

export const deleteTransactionAndDoc = async (transactionId) => {
    // Delete the transaction
    await deleteDoc(COLLECTIONS.salariesTransactions, transactionId)
    try {
    // Delete transaction document in firebase storage
    const desertRef = ref(storage, `${transactionId}.jpg`);
    await deleteObject(desertRef)
    } catch (e) {
        console.error('Was trying to delete transaction document that not exists...')
    }
};

export const deleteSalariesAndTransactionsForModel = async (salary) => {
    const {id, modelId} = salary;
    await deleteDoc(COLLECTIONS.salaries, id);

    // Delete all related transactions
    const modelTransactions = await getDocsWhere(COLLECTIONS.salariesTransactions, 'modelId', '==', modelId);

    modelTransactions.forEach(async (trnx) => {
        if (isTransactionChildOfSalary(trnx, salary)) {
            await deleteTransactionAndDoc(trnx.id)
        }
    });
}