import React, {useEffect, useState} from 'react';
import {Dimmer, Loader} from "semantic-ui-react";
import {useHistory, useParams} from "react-router-dom";
import {formatTaskForStorage, getDoc, putTaskDocumentOnStorage, updateDoc} from "../../../services/index.jsx";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import {PageHero} from "@/ui/components/index.jsx";
import {TaskForm} from "@/pages/tasks/home/TaskForm/TaskForm.jsx";
import {COLLECTIONS} from "../../../constants/collections.jsx";

const EditTask = () => {
    const {id: taskId} = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const getTask = async () => {
        setLoading(true);
        try {
            const task = await getDoc(COLLECTIONS.tasks, taskId);
            setTask(task);
        } catch (e) {
            alert(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => await getTask())()
    }, []);

    const onSubmit = async ({documents, ...task}) => {
        setLoading(true)
        try {
            await updateDoc(COLLECTIONS.tasks, taskId, formatTaskForStorage(task));
            if (documents?.length > 0) {
                await Promise.all(documents.map(async (doc) => await putTaskDocumentOnStorage(taskId, doc)))
            }
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false);
            history.push(`/admin/tasks/${taskId}`);
        }
    };

    return (
        <>
            {loading && <Dimmer active inverted><Loader inverted/></Dimmer>}
            <PageHero header="ערוך משימה" icon={iconsNames.tasks}/>
            {task && <TaskForm isLoading={loading} onSubmit={onSubmit} defaultValues={task}/>}
        </>
    );
};

export default EditTask;