import React, {useMemo} from 'react';
import dayjs from "dayjs";
import {Button, Divider, Header, Icon, Label, Segment, Table, TableBody, TableCell, TableRow} from 'semantic-ui-react';
import {EMPLOYEES, TASK_STATUS} from "@/pages/tasks/home/consts.jsx";

export const TaskDetailsTable = ({task, documents, onDeleteDocument}) => {
    const tasksRows = useMemo(() => {
        if (!task) return [];
        return [
            {label: 'תאריך אחרון לביצוע', value: dayjs(task?.deadline).format('DD.MM.YYYY')},
            {label: 'ממונה המשימה', value: EMPLOYEES?.[task?.assignee]?.label},
            {
                label: 'סטטוס',
                value: <Label color={'grey'} horizontal>
                    {TASK_STATUS?.[task?.status]?.label}
                </Label>
            },
        ];
    }, [task, documents]);

    return (
        <>
            <Divider horizontal>
                <Header as="h2">פרטים נוספים</Header>
            </Divider>
            <Segment>
                <Table definition textAlign="right">
                    <Table.Body>
                        {
                            tasksRows.map((detail) => (
                                <Table.Row key={detail.label}>
                                    <Table.Cell>{detail.label}</Table.Cell>
                                    <Table.Cell>{detail.value}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
                <Divider horizontal>
                    <Header as="h2">{!!documents?.length ? "מסמכים" : "לא קיימים מסמכים"}</Header>
                </Divider>
                {!!documents?.length && <Table definition>
                    <TableBody>
                        {documents?.map(doc => {
                            return <TableRow>
                                <TableCell>
                                    <Icon name='file outline'/> {doc?.description || 'מסמך'}
                                </TableCell>
                                <TableCell collapsing>
                                    <a style={{marginBottom: '0.5rem'}} href={doc.url} className="ui button mini icon">
                                        <Icon name="download"/>
                                    </a>
                                    <Button onClick={()=>onDeleteDocument(doc)} size="mini" negative icon="delete"/>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>}
            </Segment>
        </>
    );
};
