import * as React from 'react';
import {Button, Form, FormField, FormGroup, FormInput, Segment, TextArea} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import FileUploader from 'devextreme-react/file-uploader';
import {CustomSelect, CustomSelectWithDots} from "@/ui/components/Select/index.jsx";
import {CustomDatePicker} from "@/ui/components/CustomDatePicker/CustomDatePicker.jsx";
import {CREATE_TASK_DEFAULT_VALUE, EMPLOYEES_VALUES, TASK_STATUS_VALUES} from "../consts.jsx";
import {route as allTasksPath} from '../route.jsx'


export const TaskForm = ({onSubmit, isLoading, defaultValues = CREATE_TASK_DEFAULT_VALUE}) => {

    const {handleSubmit, formState: {errors}, control} = useForm({
        defaultValues
    });

    return (
        <Segment>
            <Form onSubmit={handleSubmit(onSubmit)} loading={isLoading}>
                <FormGroup widths="equal">
                    <Form.Field required>
                        <label>כותרת:</label>
                        <Controller
                            control={control}
                            name="title"
                            rules={{required: "שדה חובה"}}
                            render={({field}) => (
                                <FormInput
                                    {...field}
                                    {...(errors?.title && {error: {content: errors.title.message}})}
                                    type="text"
                                />
                            )}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <CustomSelect
                            control={control}
                            name="assignee"
                            label="ממונה המשימה"
                            options={EMPLOYEES_VALUES}
                            rules={{required: "שדה חובה"}}
                            {...(errors?.assignee && {error: {content: errors.assignee.message}})}
                            placeholder=''
                        />
                    </Form.Field>
                    <Form.Field required>
                        <CustomDatePicker
                            control={control}
                            name="deadline"
                            label="תאריך אחרון לביצוע"
                            rules={{required: "שדה חובה"}}
                            {...(errors?.deadline && {error: {content: errors.deadline.message}})}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <CustomSelectWithDots
                            control={control}
                            name="status"
                            label="סטטוס המשימה"
                            options={TASK_STATUS_VALUES}
                            rules={{required: "שדה חובה"}}
                            {...(errors?.status && {error: {content: errors.status.message}})}
                        />
                    </Form.Field>
                </FormGroup>
                <FormGroup>
                    <FormField width="sixteen">
                        <label>הוראות המשימה</label>
                        <Controller
                            control={control}
                            name="description"
                            render={({field}) => (<TextArea rows={20} {...field}/>)}
                        />
                    </FormField>
                </FormGroup>
                <FormGroup>
                    <FormField width="sixteen">
                        <label>מסמכים</label>
                        <Controller
                            name="documents"
                            control={control}
                            render={({field}) => (
                                <FileUploader
                                    multiple
                                    rtlEnabled
                                    uploadMode="useButtons"
                                    allowCanceling
                                    onValueChanged={(e) => field.onChange(e.value)}
                                />)
                            }
                        />
                    </FormField>
                </FormGroup>
                <FormGroup>
                    <FormField><Button color="green" type="submit">שמור</Button></FormField>
                    <FormField>
                        <Button
                            as={Link}
                            to={allTasksPath.path}
                            color="red"
                        >
                            ביטול
                        </Button>
                    </FormField>
                </FormGroup>
            </Form>
        </Segment>
    );
};