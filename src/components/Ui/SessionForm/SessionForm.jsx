import React, {useState, useEffect} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import DatePicker from "react-datepicker";
import {Form, Button, Segment, Input, Checkbox, TextArea} from "semantic-ui-react";
import {PageHero} from "../index";
import {updateDoc, addDoc, getDoc} from "../../../services";
import {COLLECTIONS} from "../../../constants/collections";
import {iconsNames} from "../CardGroups/consts";

const SessionForm = ({sessionId, updateSession}) => {
    const [isLoading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [production, setProduction] = useState("");
    const [paymentPerModel, setPaymentPerModel] = useState(0);
    const [isPostponement, setIsPostponement] = useState(false);
    const [isExternalProduction, setIsExternalProduction] = useState(false);
    const [note, setNote] = useState("")

    const {id: sessionParamId} = useParams();
    const [backLink, setBackLink] = useState("/admin");
    const id = sessionId || sessionParamId;
    const history = useHistory();

    useEffect(() => {
        if (!id) return;
        sessionId ?
            setBackLink(`admin/sessions/${sessionId}`)
            : setBackLink(`admin/sessions/`);

        const getSession = async () => {
            setLoading(true);
            try {
                const session = await getDoc(COLLECTIONS.sessions, id);
                setDate(new Date(session.date.toDate()));
                setProduction(session.production);
                setIsPostponement(session?.isPostponement || false);
                setIsExternalProduction(session?.isExternalProduction || false);
                setPaymentPerModel(session?.paymentPerModel || 0)
                setNote(session?.note || "")
            } catch (err) {
                alert(err);
            }
            setLoading(false);
        };
        getSession();
    }, [sessionId, id]);

    const pageTitle = id ? "עדכן יום צילום" : "צור יום צילום חדש";

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedDocData = {
            date,
            production,
            isPostponement,
            isExternalProduction,
            paymentPerModel,
            note
        }
        //Update session
        if (id) {
            try {
                await updateDoc(COLLECTIONS.sessions, id, updatedDocData);
                if (sessionId) {
                    updateSession((prev) => ({
                        ...prev,
                        ...updatedDocData
                    }));
                    setLoading(false);
                } else {
                    history.push(`/admin/sessions/${id}`);
                }
            } catch (err) {
                setLoading(false);
                alert(err);
            }
            //Create new session
        } else {
            try {
                const docRef = await addDoc(COLLECTIONS.sessions, {
                    ...updatedDocData,
                    createdDate: Date.now(),
                });
                history.push(`/admin/sessions/${docRef.id}`);
            } catch (err) {
                setLoading(false);
                alert(err);
            }
        }
    };

    return (
        <>
            {!sessionId && <PageHero header={pageTitle} icon={iconsNames.add_session}/>}
            <Segment loading={isLoading}>
                <Form onSubmit={submit}>
                    <Form.Group>
                        {id &&
                            <Form.Field width={2}>
                                <label>האם נדחה?</label>
                                <Checkbox
                                    toggle
                                    onChange={(e, data) => setIsPostponement(data.checked)}
                                    checked={isPostponement}
                                />
                            </Form.Field>
                        }
                        <Form.Field width={2}>
                            <label>הפקה חיצונית?</label>
                            <Checkbox
                                toggle
                                onChange={(e, data) => setIsExternalProduction(data.checked)}
                                checked={isExternalProduction}
                            />
                        </Form.Field>
                        <Form.Field width={7} required>
                            <label>שם ההפקה:</label>
                            <Input
                                value={production}
                                onChange={(e) => setProduction(e.target.value.trimStart())}
                                type="text"
                                placeholder="הקלד שם הפקה ..."
                            />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label>תשלום לכל מיוצג:</label>
                            <Input
                                value={paymentPerModel}
                                onChange={(e) => setPaymentPerModel(Number(e.target.value))}
                                type="number"
                                placeholder="הקלד סכום תשלום ..."
                            />
                        </Form.Field>
                        <Form.Field width={7} required>
                            <label>תאריך:</label>
                            <DatePicker
                                selected={date}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => setDate(date)}
                            />
                        </Form.Field>
                    </Form.Group>
                    {id &&
                        <Form.Field>
                            <label>הערה</label>
                            <TextArea value={note} onChange={(e, {value}) => setNote(value)}/>
                        </Form.Field>
                    }
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
