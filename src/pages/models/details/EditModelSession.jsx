import React, {useEffect, useState} from "react";
import {
    Modal,
    Form,
    Segment,
    Input,
    Button,
    Checkbox,
    FormField,
    FormGroup,
    Message,
    Icon
} from "semantic-ui-react";

const DEFAULT_FIELDS_VALUES = {
    hasFine: false,
    payment: 0,
    hasTransportation: 'ללא',
    note: '',
};

export const EditModelSession = ({
                                     showModalForm,
                                     doc,
                                     onClose,
                                     onSubmit,
                                 }) => {
    const [modelSession, setModelSession] = useState(doc || DEFAULT_FIELDS_VALUES);
    const [loading, setLoading] = useState(false);
    const name = doc?.model?.name;

    const [checkedFields, setCheckedFields] = useState({});
    const isMultipleEdit = !doc;

    useEffect(() => {
        setModelSession(doc || DEFAULT_FIELDS_VALUES)
    }, [doc])

    const handleSelectChange = (e) => {
        setModelSession({
            ...modelSession,
            [e.target.name]: Boolean(e.target.value),
        });
    };

    const handleTransportChange = (e) => {
        setModelSession({
            ...modelSession,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e, {name, checked}) => {
        setCheckedFields({
            ...checkedFields,
            [name]: checked,
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        // If isMultipleEdit is truth filter out un-checked fields else (edit single record) send all the fields
        const fieldsToUpdate = isMultipleEdit
            ? Object.entries(checkedFields)
                .filter(([_, value]) => value)
                .map(([key, _]) => key)
            : Object.keys(DEFAULT_FIELDS_VALUES);
        const updatedModelSession = fieldsToUpdate.reduce((acc, field) => {
            //Set default value for old db records
            if (field === 'hasFine' && !modelSession?.hasFine) {
                acc[field] = DEFAULT_FIELDS_VALUES.hasFine
            } else {
                acc[field] = modelSession[field]
            }
            return acc;
        }, {})
        await onSubmit(updatedModelSession);
        setLoading(false);
        setCheckedFields({})
        onClose(false);
    };

    return (
        <Modal
            size="tiny"
            open={showModalForm}
            style={{textAlign: "right"}}
        >
            <Modal.Header>{doc ? `עריכת מיוצג ${name || ''} ביום צילום` : 'עריכת מספר מיוצגים'}</Modal.Header>
            {!doc && <Message
                warning
            >
                <Message.Header><Icon name="warning sign"/>שים לב אתה עורך מספר רשומות</Message.Header>
                <ul>
                    <li>החלק לימין שדות שברצונך לערוך</li>
                    <li>שדות המסומנים באדום שאותם שינית, יכולו על כל הרשומות</li>
                    <li>שדות המסומנים באדום שאותם השארת ריקים, יכולו על כל הרשומות</li>
                </ul>
            </Message>}

            <Modal.Content>
                <Segment loading={loading}>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        {/*Transportation Input*/}
                        <Form.Group className={checkedFields.hasTransportation ? 'selected-field' : ''}>
                            {isMultipleEdit && <FormField>
                                <Checkbox
                                    slider
                                    name="hasTransportation"
                                    onChange={handleCheckboxChange}
                                    checked={checkedFields.hasTransportation}
                                />
                            </FormField>}
                            <Form.Field width='16'>
                                <label>הסעה:</label>
                                <select
                                    name="hasTransportation"
                                    onChange={handleTransportChange}
                                    value={modelSession?.hasTransportation || DEFAULT_FIELDS_VALUES.hasTransportation}
                                >
                                    <option value={"ללא"}>ללא</option>
                                    <option value={"עצמאית"}>עצמאית</option>
                                    <option value={"הסעה"}>הסעה</option>
                                    <option value={"איסוף"}>איסוף</option>
                                </select>
                            </Form.Field>
                        </Form.Group>
                        {/*Payment Input*/}
                        <FormGroup
                            className={checkedFields.payment ? 'selected-field' : ''}
                        >
                            {isMultipleEdit && <FormField>
                                <Checkbox
                                    slider
                                    name="payment"
                                    onChange={handleCheckboxChange}
                                    checked={checkedFields.payment}
                                />
                            </FormField>}
                            <Form.Field width='16'>
                                <label>תשלום</label>
                                <Input
                                    name="payment"
                                    onChange={(e) =>
                                        setModelSession({
                                            ...modelSession,
                                            [e.target.name]: Number(e.target.value),
                                        })
                                    }
                                    value={modelSession?.payment || DEFAULT_FIELDS_VALUES.payment}
                                    type="number"
                                    placeholder="הכנס סכום"
                                    required
                                />
                            </Form.Field>
                        </FormGroup>
                        {/*Note Input*/}
                        <Form.Group
                            className={checkedFields.note ? 'selected-field' : ''}
                        >
                            {isMultipleEdit && <FormField>
                                <Checkbox
                                    slider
                                    name="note"
                                    onChange={handleCheckboxChange}
                                    checked={checkedFields.note}
                                />
                            </FormField>}
                            <Form.Field width='16'>
                                <label>הערה</label>
                                <Input
                                    name="note"
                                    onChange={(e) => {
                                        setModelSession({
                                            ...modelSession,
                                            [e.target.name]: e.target.value,
                                        });
                                    }}
                                    value={modelSession?.note || DEFAULT_FIELDS_VALUES?.note}
                                    type="text"
                                    placeholder="הכנס הערה"
                                />
                            </Form.Field>
                        </Form.Group>
                        {/*HasFine Input*/}
                        <Form.Group
                            className={checkedFields.hasFine ? 'selected-field' : ''}
                        >
                            {isMultipleEdit && <FormField>
                                <Checkbox
                                    slider
                                    name="hasFine"
                                    onChange={handleCheckboxChange}
                                    checked={checkedFields.hasFine}
                                />
                            </FormField>}
                            <Form.Field width='16'>
                                <label>קנס</label>
                                <Checkbox
                                    name="hasFine"
                                    onChange={(e, data) => {
                                        setModelSession({
                                            ...modelSession,
                                            [data.name]: data.checked,
                                        });
                                    }}
                                    checked={!!modelSession?.hasFine || DEFAULT_FIELDS_VALUES.hasFine}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <Button disabled={isMultipleEdit && !Object.values(checkedFields).some(Boolean)}
                                    type="submit" color="green">
                                עדכן
                            </Button>
                            <Button
                                type="button"
                                color="red"
                                onClick={onClose}
                            >
                                ביטול
                            </Button>
                        </Form.Field>
                    </Form>
                </Segment>
            </Modal.Content>
        </Modal>
    );
};
