import dayjs from "dayjs";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from 'react';
import {Button, Form, FormField, Header} from "semantic-ui-react";
import {storage} from "../../../../firebase/index.jsx";
import {useModelDetailsContext} from "../../../../context/ModelDetailsContext.jsx";
import {useSalaryContext} from "./ModelSalary.jsx";
import {addDoc, updateDoc} from "../../../../services/index.jsx";
import {COLLECTIONS} from "../../../../constants/collections.jsx";
import {getDownloadURL, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";

export const ModelTransactionForm = ({transaction, transactionId}) => {
    const {model} = useModelDetailsContext();
    const {getYearlySalaries} = useSalaryContext()
    const {register, handleSubmit, errors, setValue} = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (transaction) {
            const {date, payment} = transaction;
            setValue('date', dayjs(date).format("YYYY-MM-DD"))
            setValue('payment', payment)
        }
    }, [transaction]);

    const uploadTransactionDocument = async (trnxId, file) => {
        const storageRef = ref(storage, `${trnxId}.jpg`);
        const documentSnapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(documentSnapshot.ref);
        await updateDoc(COLLECTIONS.salariesTransactions, trnxId, {
            file: downloadUrl
        })
    };

    const submit = async (transationData) => {
        if (!model.id) return;
        setLoading(true);
        try {
            const {date, payment, file, ...rest} = transationData;
            const fileData = file[0];
            //Create new transaction
            if (!transactionId) {
                const newTrnxRef = await addDoc(COLLECTIONS.salariesTransactions, {
                    date: dayjs(date).valueOf(),
                    payment: Number(payment),
                    modelId: model.id,
                    createdDate: Date.now(),
                    file: '',
                    ...rest
                });
                if (fileData) await uploadTransactionDocument(newTrnxRef.id, fileData);

            } else {
                //Update existing transaction
                await updateDoc(COLLECTIONS.salariesTransactions, transactionId, {
                    date: dayjs(date).valueOf(),
                    payment: Number(payment),
                });
                if (fileData) await uploadTransactionDocument(transactionId, fileData)
            }
            await getYearlySalaries();
            setLoading(false);
            alert('השכר עודכן בהצלחה')
        } catch (error) {
            alert(error);
            setLoading(false);
        }
    };
    return (
        <Form onSubmit={handleSubmit(submit)} noValidate>
            <Header textAlign="right">שכר לאומן</Header>
            <Form.Group widths="equal">
                <FormField required error={!!errors?.startDate}>
                    <label>תאריך תשלום</label>
                    <input
                        {...register("date", {required: true})}
                        type="date"
                    />
                </FormField>
                <FormField required error={!!errors?.payment}>
                    <label>סכום התשלום</label>
                    <input
                        {...register("payment", {required: true})}
                        type="number"
                    />
                </FormField>
                <FormField>
                    <label>הוסף קובץ</label>
                    <input type="file" {...register("file", {required: false})}/>
                </FormField>
            </Form.Group>
            <Button
                centered="true"
                color="green"
                loading={loading}
                disabled={loading}
            >
                שמור
            </Button>
        </Form>
    );
};