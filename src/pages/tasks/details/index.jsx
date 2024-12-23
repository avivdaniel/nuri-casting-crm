import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import {
    Button, Confirm,
    Dimmer,
    Grid,
    Header,
    Loader,
    Menu,
    MenuItem,
    Message,
    MessageHeader,
    Segment
} from "semantic-ui-react";
import {TaskDetailsTable} from "./TaskDetailsTable/TaskDetailsTable.jsx";
import {deleteDoc, deleteTaskDocument, getDoc, getDocSubCollection} from "../../../services/index.jsx";
import {COLLECTIONS} from "../../../constants/collections.jsx";
import {path as allTasksPath} from '@/pages/tasks/home/route.jsx';

const DetailsTask = () => {
    const {id: taskId} = useParams();
    const history = useHistory();
    const [task, setTask] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

    const getTask = async () => {
        const task = await getDoc(COLLECTIONS.tasks, taskId);
        setTask(task);
    };

    const getTaskDocuments = async () => {
        const documents = await getDocSubCollection(COLLECTIONS.tasks, 'documents', taskId);
        setDocuments(documents);
    };

    const handleDeleteTaskDocument = async (document) => {
        try {
            setLoading(true);
            await deleteTaskDocument(taskId, document);
            await getTaskDocuments();
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmDeleteTask = async () => {
        try {
            setLoading(true);
            await deleteDoc(COLLECTIONS.tasks, taskId);
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false);
            history.push(allTasksPath)
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await getTask();
                await getTaskDocuments();
            } catch (err) {
                alert(err);
                setTask(null);
                setDocuments(null);
            } finally {
                setLoading(false)
            }
        })()
    }, []);

    return (
        <>
            {loading && <Dimmer active inverted><Loader inverted/></Dimmer>}
            {task && <>
                <Confirm
                    content="האם אתה בטוח שברצונך למחוק את המשימה?"
                    confirmButton="מחק משימה"
                    cancelButton="ביטול"
                    open={confirmDeleteOpen}
                    onCancel={() => setConfirmDeleteOpen(false)}
                    onConfirm={handleConfirmDeleteTask}
                />
                <Menu>
                    <MenuItem>
                        <Button positive as={Link} to={`/admin/tasks/${taskId}/edit`}>
                            ערוך משימה
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button negative onClick={() => setConfirmDeleteOpen(true)}>
                            מחק משימה
                        </Button>
                    </MenuItem>
                </Menu>
                <Segment className="noprint" placeholder>
                    <Header>
                        <Grid columns={2} divided>
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    <Header textAlign="center" as="h2">{task?.title}</Header>
                                    <Segment textAlign="center">
                                        <Grid>
                                            <Grid.Column floated verticalAlign="middle">
                                                {task?.description || <Message warning>
                                                    <MessageHeader>לא קיים תיאור למשימה</MessageHeader>
                                                </Message>}
                                            </Grid.Column>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <TaskDetailsTable task={task} documents={documents} onDeleteDocument={handleDeleteTaskDocument}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Header>
                </Segment>
            </>}
        </>
    );
};

export default DetailsTask;