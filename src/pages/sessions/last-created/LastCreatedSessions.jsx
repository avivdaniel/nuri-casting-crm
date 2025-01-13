import React, {useState} from 'react';
import Radio from "semantic-ui-react/dist/commonjs/addons/Radio";
import {Button, Form, Segment} from "semantic-ui-react";

import LastCreatedResults from "./LastCreatedResults.jsx";
import useStickyState from "@/ui/hooks/useStickyState.jsx";
import {PageHero} from "@/ui/components/index.jsx";
import {COLLECTIONS} from "../../../constants/collections.jsx";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import {getCollectionByDateRange} from "../../../services/getCollection.jsx";

const searchCollectionsParameters = {
    sessions: COLLECTIONS.sessions,
    models: COLLECTIONS.models
};

const LastCreatedSessions = () => {
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useStickyState([], 'last-created-sessions')
    const [searchParameter, setSearchParameter] = useState(searchCollectionsParameters.models)

    const getResults = async () => {
        setLoading(true);
        try {
            const docs = await getCollectionByDateRange(searchParameter, startDate, endDate);
            setResults(docs.sort((a, b) => b.date - a.date));
            setLoading(false);
        } catch (e) {
            setResults([]);
            setLoading(false);
            alert(e);
            console.error(e);
        }
    }

    const changeSearchCollection = (collectionName) => {
        setResults([])
        setSearchParameter(collectionName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await getResults();
    };

    return (
        <div>
            <PageHero icon={iconsNames.reports} header='דו״ח לפי תאריך יצירה'/>
            <Segment className="noprint">
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Field width={8}>
                            <input required type="date" onChange={(e) => setStartDate(e.target.value)}/>
                        </Form.Field>
                        <Form.Field width={10}>
                            <input required type="date" onChange={(e) => setEndDate(e.target.value)}/>
                        </Form.Field>
                        <Form.Field width={2}>
                            <Radio
                                checked={searchParameter === searchCollectionsParameters.sessions}
                                onClick={() => changeSearchCollection(searchCollectionsParameters.sessions)}
                                value={searchCollectionsParameters.sessions}
                                toggle
                                disabled={loading}
                                label="ימי צילום"/>
                            <Radio
                                checked={searchParameter === searchCollectionsParameters.models}
                                onClick={() => changeSearchCollection(searchCollectionsParameters.models)}
                                value={searchCollectionsParameters.models}
                                toggle
                                disabled={loading}
                                label="מיוצגים"/>
                        </Form.Field>
                        <Form.Field width={6}>
                            <Button
                                color="blue"
                                fluid
                                disabled={loading}
                                loading={loading}
                                type="submit"
                            >
                                חפש
                            </Button>
                        </Form.Field>
                        <Form.Field width={2}>
                            <Button
                                style={{marginBottom: 5}}
                                className="noprint"
                                type="button"
                                icon="print"
                                color="green"
                                onClick={() => window.print()}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Segment>
            {startDate && endDate && <h2
                style={{textAlign: 'center'}}
                className="only_print">{`רשומות שנוצרו מתאריך: ${startDate} עד: ${endDate}`}</h2>}
            <LastCreatedResults results={results} loading={loading} searchParameter={searchParameter}/>
        </div>
    );
};

export default LastCreatedSessions;
