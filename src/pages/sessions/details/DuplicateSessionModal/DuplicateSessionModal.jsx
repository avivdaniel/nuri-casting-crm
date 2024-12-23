import * as React from 'react';
import {Button, Form, Modal} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import useDuplicateSession from "../../../../components/hooks/useDuplicateSession.jsx";

const DuplicateSessionModal = ({originalSession}) => {
    const {isOpen, isLoading, openModal, closeModal, setDate, onSubmit, date} = useDuplicateSession({originalSession});
    return (
        <>
            <Button onClick={openModal}>שכפל</Button>
            <Modal style={{textAlign: "right"}}
                size={'mini'}
                open={isOpen}
                onClose={isOpen}
            >
                <Modal.Header>שכפל יום צילום</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Field required>
                            <label>תאריך:</label>
                            <DatePicker
                                selected={date}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => setDate(date)}
                            />
                        </Form.Field>
                        <Modal.Actions>
                            <Button type="submit" disabled={!date || isLoading} loading={isLoading} color="green">
                                שמור
                            </Button>
                            <Button type="button" disabled={isLoading} negative onClick={closeModal}>
                                סגור
                            </Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        </>

    );
};

export default DuplicateSessionModal;