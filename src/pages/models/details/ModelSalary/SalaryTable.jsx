import * as React from 'react';
import {Accordion, Message, Table} from "semantic-ui-react";
import {YearlySalaryForm} from "./YearlySalaryForm.jsx";
import {useSalaryContext} from "./ModelSalary.jsx";
import {TransactionRow} from "./TransactionRow.jsx";

export const SalaryTable = ({salary}) => {
    const {deleteTransaction} = useSalaryContext();
    const {id} = salary;

    const salaryPanels = [
        {
            key: `panel-${salary.id}1`,
            title: 'עריכת השכר השנתי',
            color: 'pink',
            content: {content: <YearlySalaryForm salaryId={id} salary={salary}/>}
        },
    ];

    const calcTotal = () => {
        let total = 0;
        if (salary?.transactions?.length) {
            salary.transactions.forEach(trx => total += trx.payment)
        }
        return salary.target - total;
    };

    const totalPayment = calcTotal();
    const isPositiveTotal = totalPayment >= 0;
    return (
        <>
            {salary?.note && <Message info content={salary.note} header="תזכורת!"/>}
            {!!salary?.transactions?.length &&
                <Table columns={3} textAlign="center">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>תאריך</Table.HeaderCell>
                            <Table.HeaderCell>תשלום</Table.HeaderCell>
                            <Table.HeaderCell>מסמך</Table.HeaderCell>
                            <Table.HeaderCell className="noprint">פעולות</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {salary.transactions.map(({id, ...props}) => {
                            return <TransactionRow {...props}
                                                   key={id}
                                                   id={id}
                                                   deleteTransaction={deleteTransaction}
                            />
                        })}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row positive={isPositiveTotal} negative={!isPositiveTotal}>
                            <Table.Cell>סה"כ:</Table.Cell>
                            <Table.Cell dir="rtl">{calcTotal()} ש"ח</Table.Cell>
                            <Table.Cell/>
                            <Table.Cell/>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            }
            {salary && <Accordion.Accordion panels={salaryPanels}/>}
        </>
    );
};