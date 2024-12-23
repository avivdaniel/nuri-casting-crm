import * as React from 'react';
import {Modal, Image} from "semantic-ui-react";
import ThanksImage from "../../../assets/images/thanks.png";
import './ThanksModal.scss';

export const ThanksModal = ({open, onClose}) => {
    return (
        <Modal
            dimmer="blurring"
            open={open}
            onClose={onClose}
            size="tiny"
            closeIcon
        >
            <Modal.Content className="modal-content">
                <Image src={ThanksImage} size="small" className="modal-image"/>
                <h2>תודה!</h2>
                <p>פרטייך נשלחו בהצלחה</p>
            </Modal.Content>
        </Modal>
    );
};