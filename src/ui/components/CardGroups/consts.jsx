import modelAdd from "../../../assets/card-images/model-add.png";
import modelSearch from "../../../assets/card-images/model-search.png";
import modelArchive from "../../../assets/card-images/archive-search.png";
import sessionAdd from "../../../assets/card-images/session-add.png";
import sessionlSearch from "../../../assets/card-images/session-search.png";
import calendar from '../../../assets/card-images/calendar.png';
import reports from '../../../assets/card-images/reports.png';
import tasks from '../../../assets/card-images/tasks.png';

export const iconsNames = {
    add_model: 'add_model',
    add_session: 'add_session',
    search_model: 'search_model',
    search_model_archive: 'search_model_archive',
    search_session: 'search_session',
    calendar: 'calendar',
    reports: 'reports',
    tasks: 'tasks',

}
export const cardIcons = {
    [iconsNames.add_model]: modelAdd,
    [iconsNames.add_session]: sessionAdd,
    [iconsNames.search_model]: modelSearch,
    [iconsNames.search_model_archive]: modelArchive,
    [iconsNames.search_session]: sessionlSearch,
    [iconsNames.calendar]: calendar,
    [iconsNames.reports]: reports,
    [iconsNames.tasks]: tasks
}