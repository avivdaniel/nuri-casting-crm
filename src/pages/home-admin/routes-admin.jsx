import * as searchModels from '@/models/search-models/route.jsx';
import * as createModel from '@/models/create-models/route.jsx';
import * as detailsModel from '@/models/details-model/route.jsx';
import * as editModel from '@/models/edit-model/route.jsx';
import * as searchArchiveModels from '@/models/search-archive-models/route.jsx';

import * as searchSessions from '@/sessions/search-sessions/route.jsx';
import * as createSession from '@/sessions/create-session/route.jsx';
import * as detailsSession from '@/sessions/details-session/route.jsx';
import * as lastSessions from '@/sessions/last-sessions/route.jsx';
import * as editSession from '@/sessions/edit-session/route.jsx';

import * as calendarPage from '@/calendar/route.jsx';

import * as allTasks from '@/tasks/all-tasks/route.jsx';
import * as createTask from '@/tasks/create-task/route.jsx';
import * as detailsTask from '@/tasks/details-task/route.jsx';
import * as editTask from '@/tasks/edit-task/route.jsx';


export default [
    //Models
    detailsModel,
    createModel,
    editModel,
    searchModels,
    searchArchiveModels,
    //Sessions
    detailsSession,
    createSession,
    editSession,
    searchSessions,
    lastSessions,
    //Tasks
    createTask,
    editTask,
    detailsTask,
    allTasks,
    //Other
    calendarPage,
]