import {CustomDataAdaptor, DataManager} from '@syncfusion/ej2-data';
import {getDocsWhereMultiple, mapAsync} from "../../services/index.jsx";
import {COLLECTIONS} from "../../constants/collections.jsx";
import {checkIsEveryoneTransported, processSessionData} from "./utils.jsx";

class CustomFirebaseAdaptor extends CustomDataAdaptor {
    processResponse(data, ds, query, xhr, request, changes) {
        return data.map(processSessionData)
    }
}

const getData = async (option) => {
    const data = JSON.parse(option.data);

    try {
        const conditions = [
            {field: 'date', operator: '>=', value: new Date(data.StartDate)},
            {field: 'date', operator: '<=', value: new Date(data.EndDate)}
        ];

        const events = await getDocsWhereMultiple(COLLECTIONS.sessions, conditions);

        const populatedEvents = await mapAsync(events, async(session) => {
            const isAllModelSessionsTransported = await checkIsEveryoneTransported(session.id);

            return {
                ...session,
                isAllModelSessionsTransported
            }
        })

        option.onSuccess(
            populatedEvents,
            { ...option, httpRequest: {} }
        );
    }
    catch (e) {
        option.onFailure({});
    }
}

export const dataManager = new DataManager({
    adaptor: new CustomFirebaseAdaptor({
        getData,
    })
});
