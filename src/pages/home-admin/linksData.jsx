//Models
import {route as CreateModelRoute} from '@/pages/models/create/route.jsx'
import {route as SearchActiveModelsRoute} from '@/pages/models/search-active/route.jsx'
import {route as SearchArchiveModelsRoute} from '@/pages/models/search-archive/route.jsx'

//Sessions
import {route as CreateSessionRoute} from '@/pages/sessions/create/route.jsx'
import {route as SearchSessionRoute} from '@/pages/sessions/search/route.jsx'
import {route as LastCreatedSessionRoute} from '@/pages/sessions/last-created/route.jsx'

//Tasks
import {route as HomeTasksRoute} from '@/pages/tasks/home/route.jsx'

//Other
import {route as CalendarRoute} from '@/pages/calendar/route.jsx';



export const items = [
    {
        link: CreateModelRoute.path,
        text: 'צור מיוצג חדש',
        image: {
            icon: 'add_model',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }, {
        link: SearchActiveModelsRoute.path,
        text: 'חפש מיוצגים פעילים',
        image: {
            icon: 'search_model',
            size: 'small',
            wrapped: true,
            ui: false
        }
    },
    {
        link: SearchArchiveModelsRoute.path,
        text: 'חפש מיוצגים בארכיון',
        image: {
            icon: 'search_model_archive',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }
    , {
        link: CreateSessionRoute.path,
        text: 'צור יום צילום חדש',
        image: {
            icon: 'add_session',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }, {
        link: SearchSessionRoute.path,
        text: 'חפש יום צילום',
        image: {
            icon: 'search_session',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }, {
        link: LastCreatedSessionRoute.path,
        text: 'דוחות',
        image: {
            icon: 'reports',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }, {
        link: CalendarRoute.path,
        text: 'יומן',
        image: {
            icon: 'calendar',
            size: 'small',
            wrapped: true,
            ui: false
        }
    }, {
        link: HomeTasksRoute.path,
        text: 'משימות',
        image: {
            icon: 'tasks',
            size: 'small',
            wrapped: true,
            ui: false
        }
    },
]