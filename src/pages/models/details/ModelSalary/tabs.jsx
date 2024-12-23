import React from "react";
import {YearlySalaryForm} from "./YearlySalaryForm.jsx";
import {SalaryTables} from "./SalaryTables.jsx";
import {ModelTransactionForm} from "./ModelTransactionForm.jsx";

export const MODEL_SALARY_TABS = [
    {menuItem: {key: 'create', content: "צור שכר שנתי"}, component: <YearlySalaryForm/>},
    {menuItem: {key: 'add', content: "הוסף שכר לאומן"}, component: <ModelTransactionForm/>},
    {menuItem: {key: 'tables', content: "דוחות"}, component: <SalaryTables/>},
]