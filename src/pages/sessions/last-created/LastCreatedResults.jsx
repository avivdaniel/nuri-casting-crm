import * as React from 'react';
import {Header, Message, Segment, Table} from "semantic-ui-react";
import Session from "@/pages/sessions/search/Session.jsx";
import Model from "../../../components/Ui/SearchModels/Model/Model.jsx";

const COLUMNS = {
    sessions: ['הפקה', 'תאריך'],
    models: ['שם מלא', 'מין', 'טלפון']
};

const LastCreatedResults = ({results, loading, searchParameter}) => {
    return (
        <Segment loading={loading}>
            <Header className="noprint">
                {results.length > 0 && <Message
                    success
                    content={`נמצאו ${
                        results.length}  תוצאות:`}
                />}
            </Header>
            <Table
                unstackable
                selectable
                textAlign="center"
                verticalAlign="middle"
            >
                <Table.Header>
                    <Table.Row>
                        {COLUMNS[searchParameter]?.map(col => <Table.HeaderCell content={col}/>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {results?.map(doc => {
                            return searchParameter === 'sessions'
                                ?
                                <Session
                                    key={doc.id}
                                    actions={false}
                                    session={doc}
                                />
                                : <Model
                                    key={doc.id}
                                    showActions={false}
                                    model={doc}
                                />
                        }
                    )}
                </Table.Body>
            </Table>
        </Segment>
    );
};

export default LastCreatedResults;
