import React, {useState} from "react";
import {Button, Container, Grid,} from "semantic-ui-react";
import {useConfirm} from "@/ui/hooks/useConfirm.jsx";
import {addDoc, getDocs, mapAsync} from "../../../../services/index.jsx";
import {AddModelSessionAlertDialog} from "../AddModelSessionAlertDialog/AddModelSessionAlertDialog.jsx";
import {COLLECTIONS} from "../../../../constants/collections.jsx";
import {SearchBar} from "./SearchBar/SearchBar.jsx";
import {SelectedModels} from "./SelectedModels/SelectedModels.jsx";
import {checkModelSessionConflicts, generateNewModelSession,} from "./AddModelSession.utils.jsx";


export const AddModelSession = ({session, getModelSessions}) => {
    const [isLoading, setLoading] = useState(false);
    const {isOpen, proceed, isConfirmed} = useConfirm();
    const [sameDaySessions, setSameDaySessions] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);

    const isModelAttendOtherSessions = async (modelId, modelName) => {
        const conflicts = await checkModelSessionConflicts({modelId, currentSession: session});
        if (conflicts.length) {
            setSameDaySessions(conflicts.map(conflictedSession => ({...conflictedSession, modelName})));
            return await isConfirmed()
        } else {
            setSameDaySessions([])
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await mapAsync(selectedModels, async (model) => {
                const modelSession = generateNewModelSession({modelId: model.value, currentSession: session})
                await addDoc(COLLECTIONS.modelSessions, modelSession)
            })
            await getModelSessions();
            setSelectedModels([]);
            alert('המיוצגים נוספו בהצלחה')
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false)
        }
    };

    const fetchModels = async (query, limit) => {
        try {
            return await getDocs(COLLECTIONS.models, "name", query, limit)
        } catch (e) {
            alert(e)
        }
    }

    const handleSelectModelSession = async (model) => {
        await isModelAttendOtherSessions(model.value, model.label)
        setSelectedModels((prevState => [...prevState, model]))
    }

    const handleRemoveModel = (modelId) => {
        setSelectedModels((prevState => prevState.filter(model => model.value !== modelId)))
    }

    return (
        <Container className="AddModelSession">
            <AddModelSessionAlertDialog proceed={proceed} open={isOpen} sessions={sameDaySessions}/>
            <Grid columns={2}>
                <Grid.Column width={14}>
                    <SearchBar
                        onChange={handleSelectModelSession}
                        onSearchSubmit={(query, limit) => fetchModels(query, limit)}
                    />
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button disabled={!selectedModels.length || isLoading} loading={isLoading}
                            onClick={submit}>הוסף</Button>
                </Grid.Column>
            </Grid>
            <SelectedModels data={selectedModels} handleRemoveModel={handleRemoveModel}/>
        </Container>
    );
};