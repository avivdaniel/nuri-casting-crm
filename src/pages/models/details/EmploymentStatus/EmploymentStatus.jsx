import React, {useEffect} from 'react';
import {Controller, useForm} from "react-hook-form";
import {Button, Form} from "semantic-ui-react";
import {CustomSelect} from "@/ui/components/Select/index.jsx";
import {useModelDetailsContext} from "../../../../context/ModelDetailsContext.jsx";
import {EMPLOYMENT_STATUS_VALUES, EMPLOYMENT_STATUS} from "./consts.jsx";

export const EmploymentStatus = () => {
    const {model, api, loadingModel} = useModelDetailsContext();
    const {handleSubmit, control, watch, register, unregister, setValue} = useForm({
        defaultValues: {
            employmentStatus: model?.employmentStatus || '',
            artistFeePercentage: model?.artistFeePercentage || "0",
            artistFeeCap: model?.artistFeeCap || "0"
        }
    });

    const watchEmploymentStatus = watch("employmentStatus");
    const isSalariedEmployee = watchEmploymentStatus === EMPLOYMENT_STATUS.salariedEmployee.value;

    const onSubmit = async (employmentData) => {
        try {
            await api.updateModel(model.id, employmentData);
        } catch (err) {
            alert(err)
        }
    };

    useEffect(() => {
        if (isSalariedEmployee) {
            register("artistFeePercentage")
            register("artistFeeCap")
        } else {
            unregister("artistFeePercentage")
            unregister("artistFeeCap")
            setValue("artistFeePercentage", "0");
            setValue("artistFeeCap", "0");
        }
    }, [register, unregister, watchEmploymentStatus]);

    return (
        <Form loading={loadingModel} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group widths={4}>
            <Form.Field>
                <CustomSelect
                    options={EMPLOYMENT_STATUS_VALUES}
                    control={control}
                    label="מעמד תעסוקתי"
                    name="employmentStatus"
                />
            </Form.Field>
            </Form.Group>
            {isSalariedEmployee &&
                <Form.Group widths={4}>
                    <Form.Field>
                        <label>אחוז שכר אומנים</label>
                        <Controller
                            control={control}
                            name="artistFeePercentage"
                            render={({field}) => (
                                <Form.Input
                                    {...field}
                                    type="number"
                                />
                            )}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>עד לסכום</label>
                        <Controller
                            control={control}
                            name="artistFeeCap"
                            render={({field}) => (
                                <Form.Input
                                    {...field}
                                    type="number"
                                />
                            )}
                        />
                    </Form.Field>
                </Form.Group>
            }
            <div style={{marginTop: 'auto'}}>
                <Button disabled={!watchEmploymentStatus} positive>עדכן</Button>
            </div>
        </Form>
    );
};