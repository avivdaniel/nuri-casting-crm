import * as React from 'react';
import {Table, Button, Checkbox, Popup, Icon} from "semantic-ui-react";
import ModelSessionItem from "./ModelSessionItem.jsx";

const ModelSessionTableData = ({
                                   modelSessions = [],
                                   model,
                                   deleteModelSession,
                                   setRequestedModelSession,
                                   handleSelectRow,
                                   selectAllCheckboxProps,
                                   selectedRows,
                                   setShowModalForm
                               }) => {

    return (
        <>
            <h1 className="only_print">{model.name}</h1>
            <Button
                className="noprint"
                icon="print"
                color="green"
                onClick={() => window.print()}
            />
            <Table textAlign="center" celled definition>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="noprint">
                            <Popup
                                inverted content='בחר את כל ימי הצילום'
                                trigger={<Checkbox {...selectAllCheckboxProps()}/>}/>
                        </Table.HeaderCell>
                        <Table.HeaderCell className="noprint">
                            סטטוס
                        </Table.HeaderCell>
                        <Table.HeaderCell>שם ההפקה</Table.HeaderCell>
                        <Table.HeaderCell>תאריך</Table.HeaderCell>
                        <Table.HeaderCell>לפני עמלה</Table.HeaderCell>
                        <Table.HeaderCell>אחרי עמלה</Table.HeaderCell>
                        <Table.HeaderCell className="noprint">הערה</Table.HeaderCell>
                        <Table.HeaderCell className="noprint">פעולות</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {modelSessions.map((modelSession) => {
                        return (
                            <ModelSessionItem
                                key={modelSession.id}
                                modelSession={modelSession}
                                model={model}
                                deleteModelSession={deleteModelSession}
                                selectedRows={selectedRows}
                                handleSelectRow={handleSelectRow}
                                setRequestedModelSession={setRequestedModelSession}
                            />
                        );
                    })}
                </Table.Body>
                <Table.Footer fullWidth className="noprint">
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan='8'>
                            <Button
                                disabled={!selectedRows.length}
                                className="icon-button"
                                floated='right'
                                icon
                                labelPosition='right'
                                size='small'
                                onClick={()=> setShowModalForm(true)}
                            >
                                <Icon name='tasks' />
                                עריכה מרובה
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </>
    );
};

export default ModelSessionTableData;