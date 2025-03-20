import React from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import DatePicker from "react-datepicker";
import {Form, Button, Segment, Checkbox, TextArea} from "semantic-ui-react";
import {PageHero} from "../index";
import {updateDoc, addDoc, getDoc} from "../../../services";
import {COLLECTIONS} from "../../../constants/collections";
import {iconsNames} from "../CardGroups/consts";
import {useForm, Controller} from "react-hook-form";

const SessionForm = ({sessionId, updateSession}) => {
    const {id: sessionParamId} = useParams();
    const id = sessionId || sessionParamId;
    const history = useHistory();
    const [backLink, setBackLink] = React.useState("/admin");
    const [isLoading, setLoading] = React.useState(false);

    const {handleSubmit, control, setValue, reset} = useForm({
        defaultValues: {
            date: new Date(),
            production: "",
            isPostponement: false,
            isExternalProduction: false,
            paymentPerModel: 0,
            note: ""
        }
    });

    React.useEffect(() => {
        if (!id) return;
        sessionId ?
            setBackLink(`admin/sessions/${sessionId}`)
            : setBackLink(`admin/sessions/`);

        const getSession = async () => {
            setLoading(true);
            try {
                const session = await getDoc(COLLECTIONS.sessions, id);
                reset({
                    date: new Date(session.date.toDate()),
                    production: session.production,
                    isPostponement: session?.isPostponement || false,
                    isExternalProduction: session?.isExternalProduction || false,
                    paymentPerModel: session?.paymentPerModel || 0,
                    note: session?.note || ""
                });
            } catch (err) {
                alert(err);
            }
            setLoading(false);
        };
        getSession();
    }, [sessionId, id, reset]);

    const pageTitle = id ? "עדכן יום צילום" : "צור יום צילום חדש";

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            if (id) {
                await updateDoc(COLLECTIONS.sessions, id, formData);
                if (sessionId) {
                    updateSession((prev) => ({
                        ...prev,
                        ...formData
                    }));
                } else {
                    history.push(`/admin/sessions/${id}`);
                }
            } else {
                const docRef = await addDoc(COLLECTIONS.sessions, {
                    ...formData,
                    createdDate: Date.now(),
                });
                history.push(`/admin/sessions/${docRef.id}`);
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!sessionId && <PageHero header={pageTitle} icon={iconsNames.add_session}/>}
            <Segment loading={isLoading}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                        {id && (
                            <Form.Field width={2}>
                                <label>האם נדחה?</label>
                                <Controller
                                    name="isPostponement"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <Checkbox
                                            toggle
                                            checked={value}
                                            onChange={(e, data) => onChange(data.checked)}
                                        />
                                    )}
                                />
                            </Form.Field>
                        )}
                        <Form.Field width={2}>
                            <label>הפקה חיצונית?</label>
                            <Controller
                                name="isExternalProduction"
                                control={control}
                                render={({field: {value, onChange}}) => (
                                    <Checkbox
                                        toggle
                                        checked={value}
                                        onChange={(e, data) => onChange(data.checked)}
                                    />
                                )}
                            />
                        </Form.Field>
                        <Form.Field width={7} required>
                            <label>שם ההפקה:</label>
                            <Controller
                                name="production"
                                control={control}
                                rules={{ required: true }}
                                render={({field}) => (
                                    <Form.Input
                                        {...field}
                                        type="text"
                                        placeholder="הקלד שם הפקה ..."
                                        onChange={(e) => field.onChange(e.target.value.trimStart())}
                                    />
                                )}
                            />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label>תשלום לכל מיוצג:</label>
                            <Controller
                                name="paymentPerModel"
                                control={control}
                                render={({field}) => (
                                    <Form.Input
                                        {...field}
                                        type="number"
                                        placeholder="הקלד סכום תשלום ..."
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                        </Form.Field>
                        <Form.Field width={7} required>
                            <label>תאריך:</label>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: true }}
                                render={({field: {value, onChange}}) => (
                                    <DatePicker
                                        selected={value}
                                        dateFormat="dd/MM/yyyy"
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Form.Field>
                    </Form.Group>
                    {id && (
                        <Form.Field>
                            <label>הערה</label>
                            <Controller
                                name="note"
                                control={control}
                                render={({field}) => (
                                    <TextArea {...field} />
                                )}
                            />
                        </Form.Field>
                    )}
                    <Button disabled={isLoading} loading={isLoading} color="green">
                        שמור
                    </Button>
                    {!sessionId && (
                        <Button
                            disabled={isLoading}
                            color="red"
                            centered="true"
                            as={Link}
                            to={backLink}
                        >
                            ביטול
                        </Button>
                    )}
                </Form>
            </Segment>
        </>
    );
};

export default SessionForm;
