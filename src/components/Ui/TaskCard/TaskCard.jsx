import * as React from 'react';
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import {Tooltip} from "devextreme-react";
import {Card, CardContent, Label} from "semantic-ui-react";
import {EMPLOYEES, STATUS_COLOR, TASK_STATUS} from "@/pages/tasks/home/consts";

export const TaskCard = ({
                             id = '',
                             title = '',
                             description = '',
                             assignee = EMPLOYEES.none.value,
                             status = TASK_STATUS.in_progress.value,
                             deadline = ''
                         }) => {
    return id && <Card as={Link} to={`/admin/tasks/${id}`} color='grey' fluid>
        <CardContent header={title}/>
        {description && <CardContent>
            <p id={`card-${id}`} className="ellipsis-text four-lines">{description}</p>

            <Tooltip
                target={`#card-${id}`}
                showEvent="mouseenter"
                hideEvent="mouseleave"
            >
                <p className="dx-tooltip">{description}</p>
            </Tooltip>
        </CardContent>}
        <CardContent extra>
            ממונה:
            <Label basic image horizontal>
                <img src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg'/>
                {EMPLOYEES?.[assignee]?.label}
            </Label>
        </CardContent>
        <CardContent extra>
            דד ליין: {dayjs(deadline).format('DD.MM.YYYY')}
        </CardContent>
        <CardContent extra>
            סטטוס:
            <Label color={STATUS_COLOR?.[status] || 'grey'} horizontal>
                {TASK_STATUS?.[status]?.label}
            </Label>
        </CardContent>
    </Card>
}