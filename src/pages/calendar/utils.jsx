import {Internationalization} from '@syncfusion/ej2-base';
import dayjs from "dayjs";
import {getModelSessionsForSession} from "../../services/index.jsx";

export const RED_COLOR = '#ff6242';
export const DEFAULT_COLOR = '#2185D0';
export const YELLOW_COLOR = '#fbbd08';
export const VIOLET_COLOR = '#8b5cf6';

const intl = new Internationalization();

/**
 * Formats the time using a specific skeleton format
 * @param {Date} date - The date to be formatted
 * @returns {string} - Formatted date string
 */
export const formatTime = (date) => {
    return intl.formatDate(date, {skeleton: 'hm'});
};

/**
 * Picks a color based on session properties
 * @param {Object} session - The session data object
 * @returns {string} - The chosen color
 */
export const pickSessionColor = (session) => {
    if (session.isPostponement && session.isExternalProduction) {
        return YELLOW_COLOR;
    } else if (session.isPostponement) {
        return RED_COLOR;
    } else if (session.isExternalProduction) {
        return VIOLET_COLOR;
    } else {
        return DEFAULT_COLOR;
    }
};


export const fieldsData = {
    id: 'Id',
    description: {name: 'Link', title: 'Link'}
}


/**
 * Processes session data and prepares it for the Scheduler
 * @param {Object} session - The session data from Firebase
 * @returns {Object} - The formatted session for the Scheduler
 */
export const processSessionData = (session) => {
    const startDate = new Date(dayjs(session.date.toDate()).hour(9).minute(0).toDate());
    return {
        ...session,
        Id: session.id,
        Subject: session.production,
        StartTime: startDate,
        EndTime: startDate,
        IsAllDay: true,
        PrimaryColor: pickSessionColor(session),
    };
};


export const checkIsEveryoneTransported = async (sessionId) => {
    const modelSessions = await getModelSessionsForSession(sessionId, false);
    return !!modelSessions?.length && modelSessions.every(modelSession => modelSession.hasTransportation !== 'ללא');
};

