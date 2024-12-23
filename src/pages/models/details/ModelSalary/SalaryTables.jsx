import * as React from 'react';
import {SalaryTable} from "./SalaryTable.jsx";
import {Accordion, Loader} from "semantic-ui-react";
import {formatDisplayDate} from "../../../../utils.jsx";
import {useSalaryContext} from "./ModelSalary.jsx";

export const SalaryTables = () => {
    const {salaries, loadingSalary} = useSalaryContext();

    const panes = salaries?.map(salary => ({
        key: `panel-${salary.id}`,
        title: `שכר אומן מתאריך ${formatDisplayDate(salary.startDate)} עד תאריך ${formatDisplayDate(salary.endDate)} סה״כ ${salary.target} ש״ח`,
        content: {content: <SalaryTable salary={salary} key={`panel-${salary.id}-content`}/>}
    }))

    return (
        <div>
            {loadingSalary
                ? <Loader active inline="centered" content='Loading'/>
                : salaries?.length ?
                    <Accordion
                        fluid
                        styled
                        defaultActiveIndex={0}
                        panels={panes}/>
                    : 'טרם קיים שכר אומן שנתי'}
        </div>
    );
};