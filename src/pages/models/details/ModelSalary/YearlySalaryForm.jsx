import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";
import {useForm} from "react-hook-form";
import {useSalaryContext} from "./ModelSalary.jsx";
import {Button, Form, FormField, Header} from "semantic-ui-react";
import {useModelDetailsContext} from "../../../../context/ModelDetailsContext.jsx";
import {deleteSalariesAndTransactionsForModel} from "../../../../services/salaries.jsx";
import {addDoc, updateDoc} from "../../../../services/index.jsx";
import {COLLECTIONS} from "../../../../constants/collections.jsx";

export const YearlySalaryForm = ({salaryId, salary}) => {
    const {model} = useModelDetailsContext();
    const {loadingSalary, getYearlySalaries} = useSalaryContext();
    const {register, handleSubmit, setValue, errors} = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (salary) {
            const {startDate, endDate, target, note} = salary;
            setValue('endDate', dayjs(endDate).format("YYYY-MM-DD"))
            setValue('startDate', dayjs(startDate).format("YYYY-MM-DD"))
            setValue('note', note)
            setValue('target', target)
        }
    }, [salary]);

    const submit = async (salaryData) => {
        if (!model.id) return;
        try {
            setLoading(true);
            const {startDate, endDate, target, ...rest} = salaryData;
            if (!salaryId) {
                await addDoc(COLLECTIONS.salaries, {
                    startDate: dayjs(startDate).valueOf(),
                    endDate: dayjs(endDate).valueOf(),
                    target: Number(target),
                    modelId: model.id,
                    createdDate: Date.now(), ...rest
                });
                alert('השכר השנתי נוצר בהצלחה')
                setLoading(false);
            } else {
                await updateDoc(COLLECTIONS.salaries, salaryId, {
                    startDate: dayjs(startDate).valueOf(),
                    endDate: dayjs(endDate).valueOf(),
                    target: Number(target),
                    ...rest
                });
                alert('השכר השנתי עודכן בהצלחה')
                setLoading(false);
            }
        } catch (error) {
            alert(error);
            setLoading(false);
        } finally {
            await getYearlySalaries();
        }
    };

    const deleteYearlySalary = async () => {
        if (window.confirm("למחוק את השכר השנתי וכל רשומותיו?")) {
            try {
                setLoading(true);
                await deleteSalariesAndTransactionsForModel(salary)
                await getYearlySalaries();
                setLoading(false);
            } catch (e) {
                setLoading(false)
                console.log(e)
            }
        }
    };

    return (<Form loading={loading || loadingSalary} onSubmit={handleSubmit(submit)} noValidate>
        <Header textAlign="right">{`${salaryId ? 'עדכן' : 'צור'} שכר שנתי`}</Header>
        <Form.Group widths="equal">
            <FormField required error={!!errors?.startDate}>
                <label>תחילת תוקף שכר</label>
                <input
                    {...register("startDate", {required: true})}
                    type="date"
                />
            </FormField>
            <FormField required error={!!errors?.endDate}>
                <label>פקיעת תוקף שכר</label>
                <input
                    {...register("endDate", {required: true})}
                    type="date"
                />
            </FormField>
            <FormField required error={!!errors?.target}>
                <label>סכום שכר שנתי</label>
                <input
                    {...register("target", {required: true})}
                    type="number"
                />
            </FormField>
        </Form.Group>
        <FormField width={16} error={!!errors?.target}>
            <label>הערה שנתית</label>
            <textarea {...register("note", {required: false})}/>
        </FormField>
        <Button
            centered="true"
            color="green"
            disabled={loading || !model.id}
        >
            שמור
        </Button>
        {salaryId && <Button color="red" type="button" onClick={deleteYearlySalary}>
            מחק שכר ורשומות
        </Button>}
    </Form>);
};