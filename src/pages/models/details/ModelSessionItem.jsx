import React from "react";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {Checkbox, Icon, Label, Table} from "semantic-ui-react";
import {calculateCommission} from "../../../utils/index.jsx";

const ModelSessionItem = ({
                              modelSession,
                              model,
                              deleteModelSession,
                              selectedRows,
                              setRequestedModelSession,
                              handleSelectRow
                          }) => {

    const {
        id: modelSessionId,
        payment,
        sessionId,
        note,
        session: {
            production: sessionProduction,
            date: sessionDate,
            isPostponement: isPostponementSession = false
        }
    } = modelSession;

    return (
        <>
            {modelSession && (
                <Table.Row
                    warning={modelSession?.hasFine}
                >
                    <Table.Cell className="noprint">
                        <Checkbox checked={selectedRows.includes(modelSessionId)} onChange={() => handleSelectRow(modelSessionId)}/>
                    </Table.Cell>
                    <Table.Cell style={{position: 'relative'}}>
                        {isPostponementSession ?
                            <Label color='red'>
                                נדחה
                            </Label> : '-'}
                    </Table.Cell>
                    <Table.Cell>
                        <Link
                            key={model.id}
                            to={`/admin/sessions/${sessionId}`}
                            style={{textDecoraction: "none", color: "black"}}
                        >
                            {sessionProduction}
                        </Link>
                    </Table.Cell>
                    <Table.Cell>
                        {dayjs(sessionDate.toDate()).format("DD/MM/YYYY")}
                    </Table.Cell>
                    <Table.Cell>{`${payment} ש"ח`}</Table.Cell>
                    <Table.Cell>{calculateCommission(model?.commission, payment)} ש״ח</Table.Cell>
                    <Table.Cell className="noprint">
                        {note && <p>{note}</p>}
                    </Table.Cell>
                    <Table.Cell className="noprint">
                        <Icon
                            disabled={selectedRows.length}
                            onClick={() => setRequestedModelSession(modelSession)}
                            color="green"
                            link
                            name="edit"
                            to="#"
                        />
                        <Icon
                            color="red"
                            link
                            onClick={() => deleteModelSession(modelSessionId)}
                            name="delete"
                            to="#"
                        />
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    );
};

export default ModelSessionItem;
