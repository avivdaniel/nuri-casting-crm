import * as React from 'react';
import {MODEL_SALARY_TABS} from "./tabs.jsx";
import {Tab} from "semantic-ui-react";
import {useSalaryContext} from "./ModelSalary.jsx";

export const TabsRenderer = () => {
    const {getYearlySalaries} = useSalaryContext();
    const tabs = MODEL_SALARY_TABS.map(({component, ...restTab}, i) => {
        return {
            ...restTab,
            render: () => (
                component && <Tab.Pane key={i}>
                    {component}
                </Tab.Pane>
            )
        }
    });

    return (
        <Tab
            onTabChange={async (e, i) => {
                if (i.activeIndex === 2) await getYearlySalaries()
            }}
            menu={{fluid: true, vertical: true, color: 'blue', inverted: true}}
            menuPosition='left' panes={tabs}/>
    );
};