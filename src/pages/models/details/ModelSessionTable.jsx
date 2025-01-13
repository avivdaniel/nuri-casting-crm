import React, {useEffect, useMemo, useState} from "react";
import {Segment, Tab} from "semantic-ui-react";
import dayjs from "dayjs";
import {deleteDoc, getModelSessionsForModel, mapAsync, updateModelSession} from "../../../services/index.jsx";
import ModelSessionTableData from "./ModelSessionTableData.jsx";
import {useModelDetailsContext} from "../../../context/ModelDetailsContext.jsx";
import {useSelectTableRows} from "@/ui/hooks/useSelectTableRows.jsx";
import {EditModelSession} from "./EditModelSession.jsx";

const ModelSessionTable = () => {
    const [loading, setLoading] = useState(true);
    const [modelSessions, setModelSessions] = useState([]);
    const [, setTableData] = useState({});
    const [requestedModelSession, setRequestedModelSession] = useState(null);
    const {model} = useModelDetailsContext();

    const [showModalForm, setShowModalForm] = useState(false);
    const {selectedRows, clearAllSelectedRows, handleSelectRow, selectAllCheckboxProps} = useSelectTableRows({rows: modelSessions})

    const getModelSessions = async () => {
        try {
            const modelSessions = await getModelSessionsForModel(model.id);
            setModelSessions(modelSessions.sort((a, b) => a.session.date - b.session.date));
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (requestedModelSession) setShowModalForm(true);
    }, [requestedModelSession]);

    const onCloseModelEditForm = () => {
        setShowModalForm(false)
        setRequestedModelSession('')
    }

    const handleChange = (e, data) => {
        //Clear selected rows on tab changed
        clearAllSelectedRows()
        setTableData(data);
    }

    const handleSetRequestedModelSession = (modelSession) => {
        setRequestedModelSession(modelSession);
        setShowModalForm(true)
    }

    useEffect(() => {
        (async()=> await getModelSessions())();
    }, [model.id]);


    const deleteModelSession = async (modelSessionId) => {
        if (window.confirm("למחוק את המיוצג מהשתתפות ביום הצילום?")) {
            try {
                await deleteDoc("modelSessions", modelSessionId);
                await getModelSessions()
            } catch (err) {
                alert(err);
            }
        }
    };

    const handleUpdateMultipleModelSessions = async (modelSessionTemplate) => {
        await mapAsync(selectedRows, async (modelSessionId)=> await updateModelSession(modelSessionTemplate, modelSessionId) )
        await getModelSessions();
    };

    const handleUpdateModelSession = async (modelSession) => {
        await updateModelSession(modelSession, requestedModelSession.id)
        await getModelSessions();
    };

    const historyPanes = useMemo(() => {
        const today = dayjs();
        const currentYear = today.year();

        const { futureSessions, currentYearSessions, pastSessionsByYear, pastSessionsBefore2023 } = modelSessions.reduce((acc, modelSession) => {
            const sessionDate = dayjs(modelSession.session.date.toDate());
            const sessionYear = sessionDate.year();

            if (sessionDate.isAfter(today)) {
                acc.futureSessions.push(modelSession);
            } else if (sessionYear === currentYear) {
                acc.currentYearSessions.push(modelSession);
            } else if (sessionYear >= 2023) {
                if (!acc.pastSessionsByYear[sessionYear]) {
                    acc.pastSessionsByYear[sessionYear] = [];
                }
                acc.pastSessionsByYear[sessionYear].push(modelSession);
            } else {
                acc.pastSessionsBefore2023.push(modelSession);
            }

            return acc;
        }, { futureSessions: [], currentYearSessions: [], pastSessionsByYear: {}, pastSessionsBefore2023: [] });

        const tabs = [
            {
                menuItem: 'ימי צילום עתידיים',
                modelSessions: futureSessions
            },
            {
                menuItem: `היסטוריית ימי צילום שנה נוכחית (${currentYear})`,
                modelSessions: currentYearSessions
            },
            ...Object.entries(pastSessionsByYear).sort(([year1], [year2]) => parseInt(year2) - parseInt(year1)).map(([year, sessions]) => ({
                menuItem: `היסטוריית ימי צילום (${year})`,
                modelSessions: sessions
            })),
            {
                menuItem: 'ימי צילום לפני 2023',
                modelSessions: pastSessionsBefore2023
            }
        ];

        return tabs.map(tab => ({
            ...tab,
            render: () => (
                <Tab.Pane>
                    <ModelSessionTableData
                        modelSessions={tab.modelSessions}
                        model={model}
                        selectAllCheckboxProps={selectAllCheckboxProps}
                        selectedRows={selectedRows}
                        handleSelectRow={handleSelectRow}
                        setRequestedModelSession={handleSetRequestedModelSession}
                        deleteModelSession={deleteModelSession}
                        setShowModalForm={setShowModalForm}
                    />
                </Tab.Pane>
            )
        }));
    }, [modelSessions, selectedRows, selectAllCheckboxProps, model]);

    return (
        <Segment loading={loading}>
            <Tab panes={historyPanes} onTabChange={handleChange}/>
            {showModalForm && <EditModelSession
                showModalForm={showModalForm}
                onClose={onCloseModelEditForm}
                onSubmit={requestedModelSession ? handleUpdateModelSession : handleUpdateMultipleModelSessions}
                doc={requestedModelSession}
            />}
        </Segment>
    );
};

export default ModelSessionTable;
