import * as React from 'react';
import {Button, Menu, MenuItem} from "semantic-ui-react";
import {Link} from "react-router-dom";
import Select from "react-select";
import {path as createTaskPath} from "@/pages/tasks/create/route.jsx";
import {EMPLOYEES_VALUES, TASK_STATUS, TASK_STATUS_VALUES} from "../consts.jsx";

export const TasksMenu = ({filters, handleAssigneeChange, handleStatusChange}) => {

    return (
        <Menu>
            <MenuItem>
                <Button as={Link} to={createTaskPath} primary>צור משימה חדשה</Button>
            </MenuItem>
            <MenuItem position="left">
                <Select
                    isRtl
                    isClearable
                    placeholder='פילטור לפי ממונה'
                    options={EMPLOYEES_VALUES}
                    onChange={(selectedOption) => handleAssigneeChange(selectedOption?.value ?? '')}
                    value={EMPLOYEES_VALUES.find((option) => option.value === filters.assigneeFilter)}
                    styles={{
                        container: (base) => ({...base, width: '13rem'})
                    }}
                />
                <Select
                    isRtl
                    isMulti
                    isClearable={false}
                    placeholder='פילטור לפי סטטוס'
                    options={TASK_STATUS_VALUES.filter(option => option.value !== TASK_STATUS.completed.value)}
                    onChange={handleStatusChange}
                    value={TASK_STATUS_VALUES.filter(option=> filters.statusFilter.includes(option.value))}
                    styles={{
                        container: (base) => ({...base, width: '22rem', marginRight: '1rem'})
                    }}
                />
            </MenuItem>
        </Menu>
    );
};