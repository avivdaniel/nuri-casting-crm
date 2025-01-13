import React, {useState} from 'react';
import {Icon, Table, TableRow, Modal, Header} from "semantic-ui-react";
import {formatDisplayDate} from "../../../../utils/index.jsx";
import {ModelTransactionForm} from "./ModelTransactionForm.jsx";


export const TransactionRow = ({date, payment, file, createdAt, id, deleteTransaction}) => {
    const [open, setOpen] = useState(false)

    return (
        <TableRow key={createdAt}>
            <Table.Cell>{formatDisplayDate(date)}</Table.Cell>
            <Table.Cell>{payment}</Table.Cell>
            <Table.Cell>{file &&
                <a
                    target="_blank"
                    href={file}
                >
                    לינק לקובץ
                </a>
            }</Table.Cell>
            <Table.Cell className="noprint">
                <Modal
                    closeIcon
                    open={open}
                    trigger={<Icon style={{color: "green"}} link name="edit"/>}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                >
                    <Header icon='edit' content=' עריכת שכר לאומן '/>
                    <Modal.Content>
                        <ModelTransactionForm transactionId={id} transaction={{createdAt, date, payment}}/>
                    </Modal.Content>
                </Modal>
                <Icon
                    style={{color: "red"}}
                    link
                    name="delete"
                    onClick={() => deleteTransaction(id)}
                />
            </Table.Cell>
        </TableRow>
    );
};