import React, {useRef, useState} from 'react';
import {SearchBar} from "./SearchBar/SearchBar.jsx";
import {addDoc, fetchSessions} from "../../../../services/index.jsx";
import {COLLECTIONS} from "../../../../constants/collections.jsx";
import {Button, Divider, Grid, GridColumn, GridRow, Header, Icon, Segment} from "semantic-ui-react";
import {
    checkModelSessionConflicts,
    generateNewModelSession
} from "@/pages/sessions/details/AddModelSession/AddModelSession.utils.jsx";
import {useModelDetailsContext} from "../../../../context/ModelDetailsContext.jsx";
import {useConfirm} from "@/ui/hooks/useConfirm.jsx";
import {
    AddModelSessionAlertDialog
} from "@/pages/sessions/details/AddModelSessionAlertDialog/AddModelSessionAlertDialog.jsx";

const AddModelSession = () => {
    const {model} = useModelDetailsContext();
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const {isOpen, proceed, isConfirmed} = useConfirm();
    const [sameDaySessions, setSameDaySessions] = useState([]);

    const selectRef = useRef(null);

    const isModelAttendOtherSessions = async (modelId, modelName, currentSession) => {
        if (!currentSession) return;
        const conflicts = await checkModelSessionConflicts({modelId, currentSession});
        if (conflicts?.length) {
            setSameDaySessions(conflicts.map(conflictedSession => ({...conflictedSession, modelName})));
            return await isConfirmed()
        } else {
            setSameDaySessions([])
        }
    };

    const handleSelectSession = async (session) => {
        await isModelAttendOtherSessions(model.id, model.name, session)
        setSession(session);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const modelSession = generateNewModelSession({modelId: model.id, currentSession: session})
            await addDoc(COLLECTIONS.modelSessions, modelSession);
            setSession(null);
            if (selectRef.current) {
                selectRef.current.clearValue(); // Clear the selected value
            }
            alert('המיוצג נוסף בהצלחה');
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <Segment placeholder>
            <AddModelSessionAlertDialog proceed={proceed} open={isOpen} sessions={sameDaySessions}/>
            <Grid columns={2} stackable textAlign='center' style={{minHeight: "350px"}}>
                <Divider vertical/>

                <GridRow verticalAlign='middle'>
                    <GridColumn>
                        <Header icon>
                            <Icon name='search'/>
                            שם ההפקה
                        </Header>

                        <SearchBar
                            ref={selectRef}
                            onChange={handleSelectSession}
                            onSearchSubmit={(query, limit) => fetchSessions(query, limit)}
                        />
                    </GridColumn>

                    <GridColumn>
                        <Header icon>
                            <Icon name='add'/>
                            הוסף ליום צילום
                        </Header>
                        <Button disabled={!session?.id || loading} loading={loading} onClick={submit}
                                primary>הוסף</Button>
                    </GridColumn>
                </GridRow>
            </Grid>
        </Segment>
    );
};

export default AddModelSession;