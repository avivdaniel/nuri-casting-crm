import * as React from 'react';
import {Header, Message, Modal, Button} from "semantic-ui-react";
import dayjs from "dayjs";

export const AddModelSessionAlertDialog = ({open, proceed, sessions}) => {

    return (
        <Modal
            onClose={() => proceed}
            open={open}
            size='small'
            className='AddModelSessionAlertDialog'
        >
            <Header icon>
                <Message negative>
                    <Message.Header>שים לב!</Message.Header>
                </Message>
            </Header>
            <Modal.Content>
                {!!sessions.length && sessions.map(({session, modelName}) => (
                    <Message
                        key={session.id}>
                        <Message.Header>
                            <Message.Header>
                                {`שים לב שהמיוצג **${modelName}** כבר משתתף ב${dayjs(session.date.toDate()).format("DD/MM/YYYY")} בהפקה ${session.production}`}
                            </Message.Header>
                        </Message.Header>
                    </Message>
                ))}
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" onClick={proceed}>
                    סגור
                </Button>
            </Modal.Actions>
        </Modal>
    );
};