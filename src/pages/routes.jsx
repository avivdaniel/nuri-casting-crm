import {route as HomeRoute} from '@/pages/home-admin/route.jsx'

//Models
import {route as CreateModelRoute} from '@/pages/models/create/route.jsx'
import {route as DetailsModelRoute} from '@/pages/models/details/route.jsx'
import {route as EditModelRoute} from '@/pages/models/edit/route.jsx'
import {route as SearchActiveModelsRoute} from '@/pages/models/search-active/route.jsx'
import {route as SearchArchiveModelsRoute} from '@/pages/models/search-archive/route.jsx'

//Sessions
import {route as DetailsSessionRoute} from '@/pages/sessions/details/route.jsx'
import {route as CreateSessionRoute} from '@/pages/sessions/create/route.jsx'
import {route as EditSessionRoute} from '@/pages/sessions/edit/route.jsx'
import {route as SearchSessionRoute} from '@/pages/sessions/search/route.jsx'
import {route as LastCreatedSessionRoute} from '@/pages/sessions/last-created/route.jsx'

//Tasks
import {route as HomeTasksRoute} from '@/pages/tasks/home/route.jsx'
import {route as CreateTaskRoute} from '@/pages/tasks/create/route.jsx'
import {route as EditTaskRoute} from '@/pages/tasks/edit/route.jsx'
import {route as DetailsTaskRoute} from '@/pages/tasks/details/route.jsx'

//Other
import {route as CalendarRoute} from '@/pages/calendar/route.jsx';


export const adminRoutes = [
    HomeRoute,
    // Models
    SearchActiveModelsRoute,
    CreateModelRoute,
    SearchArchiveModelsRoute,
    EditModelRoute,
    DetailsModelRoute,
    //Sessions
    SearchSessionRoute,
    CreateSessionRoute,
    LastCreatedSessionRoute,
    EditSessionRoute,
    DetailsSessionRoute,
    //Tasks
    HomeTasksRoute,
    CreateTaskRoute,
    EditTaskRoute,
    DetailsTaskRoute,
    // Other
    CalendarRoute,
];


import {route as HomeGuestRoute} from '@/pages/home-guest/route.jsx';
import {route as PublicCreateModelRoute} from '@/pages/public/create-models/route.jsx';

export const guestRoutes = [
    HomeGuestRoute,
    PublicCreateModelRoute
]