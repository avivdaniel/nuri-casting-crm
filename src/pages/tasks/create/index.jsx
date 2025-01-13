import {useState} from 'react';
import {useHistory} from "react-router-dom";
import dayjs from "dayjs";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import {PageHero} from "@/ui/components/index.jsx";
import {TaskForm} from "@/pages/tasks/home/TaskForm/TaskForm.jsx";
import {addDoc, formatTaskForStorage, putTaskDocumentOnStorage} from "@/services/index.jsx";
import {COLLECTIONS} from "@/constants/collections.jsx";
import {route as allTasksPath} from '@/pages/tasks/home/route.jsx'
import {route as taskPagePath} from '@/pages/tasks/details/route.jsx'

const CreateTask = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const onSubmit = async ({documents, ...newTask}) => {
        setLoading(true);
        try {
            const docRef = await addDoc(COLLECTIONS.tasks, {
                ...formatTaskForStorage(newTask),
                createdDate: dayjs().valueOf(),
            });
            if (documents?.length > 0) {
                await Promise.all(documents.map(async (doc) => await putTaskDocumentOnStorage(docRef.id, doc)))
            }
            history.push(taskPagePath.getPath(docRef.id));
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <PageHero header="צור משימה חדשה" icon={iconsNames.tasks}/>
            <TaskForm isLoading={loading} onSubmit={onSubmit} backLink={allTasksPath.path}/>
        </>
    );
};

export default CreateTask;