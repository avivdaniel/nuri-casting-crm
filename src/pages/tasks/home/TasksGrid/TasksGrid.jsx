import * as React from 'react';
import { Card } from 'semantic-ui-react';
import { TaskCard } from '@/ui/components/TaskCard/TaskCard.jsx';

const TasksGrid = ({ tasks }) => {
    return (
        !!tasks?.length && (
            <Card.Group stackable itemsPerRow={3}>
                {tasks.map(task => (
                    <TaskCard {...task} key={task.id} />
                ))}
            </Card.Group>
        )
    );
};

export default TasksGrid;
