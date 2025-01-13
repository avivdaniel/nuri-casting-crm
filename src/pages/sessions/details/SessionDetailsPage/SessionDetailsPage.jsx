import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Button, Message, Tab} from "semantic-ui-react";
import ModelSessions from "../ModelSessions/ModelSessions.jsx";
import {PageHero, PageLoader} from "@/ui/components/index.jsx";
import {deleteDoc, getDoc, getModelSessionsForSession} from "@/services/index.jsx";
import {AddModelSession} from "../AddModelSession/AddModelSession.jsx";
import SessionForm from "@/ui/components/SessionForm/SessionForm.jsx";
import DuplicateSessionModal from "../DuplicateSessionModal/DuplicateSessionModal.jsx";
import {COLLECTIONS} from "@/constants/collections.jsx";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import SessionLabels from "../SessionLabels/SessionLabels.jsx";
import './SessionDetailsPage.scss';

const SessionDetailsPage = () => {
    const history = useHistory();
    const { id: sessionId, tab: initialTab } = useParams();
    const [session, setSession] = useState(null);
    const [modelSessions, setModelSessions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [tab, setTab] = useState(initialTab);

    const getSession = async () => {
        if (!sessionId) return;
        const session = await getDoc(COLLECTIONS.sessions, sessionId);
        setSession({...session, date: session.date.toDate()});
    };

    const getModelSessions = async () => {
        const modelSessions = await getModelSessionsForSession(sessionId);
        setModelSessions(modelSessions.sort((a, b) => a.model.name > b.model.name ? 1 : b.model.name > a.model.name ? -1 : 0));
    };

    const deleteSession = async () => {
        if (window.confirm("למחוק את יום הצילום?")) {
            setLoading(true);
            try {
                await deleteDoc("sessions", sessionId);
                history.push("/admin/sessions");
            } catch (err) {
                alert(err);
            }
        }
    };

    const panes = [
        {
            menuItem: "צפה במיוצגים המשתתפים ביום זה",
            render: () => (
                <Tab.Pane>
                    <ModelSessions session={session} modelSessions={modelSessions} getModelSessions={getModelSessions}/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "הוסף מיוצג ליום צילום",
            render: () => (
                <Tab.Pane>
                    <AddModelSession session={session} getModelSessions={getModelSessions} sessionId={sessionId} history={history}/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "עדכן",
            render: () => (
                <Tab.Pane>
                    <SessionForm sessionId={sessionId} updateSession={setSession}/>
                </Tab.Pane>
            ),
        },
        {
            menuItem: "מחק",
            render: () => (
                <Tab.Pane>
                    <Button color="red" onClick={deleteSession}>
                        מחק יום צילום
                    </Button>
                </Tab.Pane>
            ),
        },
    ];

    useEffect(() => {
        setTab(initialTab);
        (async () => {
            setLoading(true)
            try {
                await getSession();
                await getModelSessions();
            } catch (e) {
                setModelSessions([])
                alert(e);
            } finally {
                setLoading(false)
            }
        })();
    }, [sessionId, initialTab]);

    return (
        <>
            {isLoading ? (
                <PageLoader/>
            ) : (
                <>
                    {session && (
                        <div className="SessionDetailsPage">
                            <PageHero
                                icon={iconsNames.search_session}
                                header={session.production}
                                date={session.date}
                                labels={<SessionLabels session={session} modelSessions={modelSessions}/>}
                            >
                                {session?.note && <Message warning>
                                    <p>{session.note}</p>
                                </Message>}
                                <DuplicateSessionModal originalSession={session}/>
                            </PageHero>
                            <Tab
                                defaultActiveIndex={tab}
                                menu={{attached: true}}
                                panes={panes}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};
export default SessionDetailsPage;
