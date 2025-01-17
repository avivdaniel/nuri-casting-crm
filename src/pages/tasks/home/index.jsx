import React, {useEffect, useState} from 'react';
import {Button, Tab, TabPane} from "semantic-ui-react";
import {PageHero} from "@/ui/components/index.jsx";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import TasksGrid from "./TasksGrid/TasksGrid.jsx";
import {TasksMenu} from "./TasksMenu/TasksMenu.jsx";
import {COLLECTIONS} from "@/constants/collections.jsx";
import {useToastContext} from "@/context/ToastContext.jsx";
import {fetchPaginatedData, PAGINATION_ACTIONS} from "../../../services/index.jsx";
import {TASK_STATUS, STATUS_FILTER_DEFAULT_VALUE} from "./consts.jsx";

const Tasks = () => {
    const {setToastConfig} = useToastContext();
    const [tasks, setTasks] = useState([]);
    const [pageAction, setPageAction] = useState(PAGINATION_ACTIONS.next);
    const [page, setPage] = useState(1);
    const [afterThis, setAfterThis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_DEFAULT_VALUE);
    const [assigneeFilter, setAssigneeFilter] = useState('');

    const handleNextPage = () => {
        setPageAction(PAGINATION_ACTIONS.next);
        setPage(prevState => prevState + 1)
    };

    const handleClearPaginationState = () => {
        setTasks([]);
        setPage(1);
        setAfterThis(null);
    };

    const handleClearFiltersState = () => {
        setAssigneeFilter('');
        setStatusFilter(STATUS_FILTER_DEFAULT_VALUE);
    }

    const handleStatusChange= (selectedOptions = []) => {
        handleClearPaginationState();
        const selectedValues = !!selectedOptions?.length ? selectedOptions.map(option => option.value) : STATUS_FILTER_DEFAULT_VALUE;
        setStatusFilter(selectedValues);
    };

    const handleAssigneeChange = (assignee) => {
        handleClearPaginationState();
        setAssigneeFilter(assignee);
    };

    const getWhereFields = () => {
        if (activeIndex === 0) {
            let whereFields = [{name: 'status', value: statusFilter, operator: 'in'}]
            if (assigneeFilter) whereFields.push({name: 'assignee', value: assigneeFilter, operator: '=='})
            return whereFields
        } else if (activeIndex === 1) {
            return [{name: 'status', value: [TASK_STATUS.completed.value], operator: 'in'}]
        }
    };

    const fetchTasks = async () => {
        console.log('FETCH TASKS!')
        setLoading(true);

        const PAGE_SIZE = 20;
        const entityObject = {
            collection: COLLECTIONS.tasks,
            records_limit: PAGE_SIZE,
            pageAction: pageAction,
            page,
            orderByField: 'createdDate',
            orderByOrder: 'desc',
            lastIndex: afterThis,
            whereFields: getWhereFields()
        }

        try {
            const records = await fetchPaginatedData(entityObject)
            if (records?.length > 0) {
                const last_index = records.length - 1;
                setAfterThis(records[last_index][entityObject.orderByField])

                setTasks(prevState => {
                    const existingIds = new Set(prevState ? prevState.map(task => task.id) : []);
                    const newTasks = records.filter(task => !existingIds.has(task.id));
                    return [...(prevState || []), ...newTasks];
                });
            } else {
                setToastConfig({
                    type: 'error',
                    message: page === 1 ? 'לא נמצאו תוצאות' : 'לא קיימות עוד תוצאות',
                    isVisible: true
                });
            }
        } catch (e) {
            console.log(e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => await fetchTasks())()
    }, [page, assigneeFilter, statusFilter, activeIndex]);

    const showMoreBtn = <>
        <div style={{paddingBlock: '2rem'}}>
            <Button positive onClick={handleNextPage}>הצג עוד</Button>
        </div>
    </>

    const panes = [
        {
            menuItem: 'משימות', render: () => <TabPane loading={loading}>
                <TasksMenu filters={{assigneeFilter, statusFilter}} handleAssigneeChange={handleAssigneeChange} handleStatusChange={handleStatusChange}/>
                <TasksGrid tasks={tasks}/>
                {showMoreBtn}
            </TabPane>
        },
        {
            menuItem: 'משימות שבוצעו', render: () => <TabPane loading={loading}>
                <TasksGrid tasks={tasks}/>
                {showMoreBtn}
            </TabPane>
        },
    ];

    const handleTabChange = async (e, {activeIndex}) => {
        setActiveIndex(activeIndex)
        handleClearPaginationState();
        handleClearFiltersState();
    };

    return (
        <>
            <PageHero header="משימות" icon={iconsNames.tasks}/>
            <Tab activeIndex={activeIndex} onTabChange={handleTabChange} menu={{pointing: true}} panes={panes}/>
        </>
    );
};

export default Tasks;