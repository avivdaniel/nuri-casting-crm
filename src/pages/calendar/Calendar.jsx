import React, {useRef} from 'react';
import {
    Agenda,
    Week,
    Month,
    TimelineViews,
    TimelineMonth,
    Inject,
    ScheduleComponent,
    ViewDirective,
    ViewsDirective
} from '@syncfusion/ej2-react-schedule';
import {useHistory} from "react-router-dom";
import {registerLicense} from '@syncfusion/ej2-base';
import {useCalendarTemplates} from "./useCalendarTemplates.jsx";
import {PageHero} from "@/ui/components/index.jsx";
import {iconsNames} from "@/ui/components/CardGroups/consts.jsx";
import {dataManager} from "./dataManager.jsx";

import {L10n} from '@syncfusion/ej2-base';
import {loadCldr} from '@syncfusion/ej2-base';
import heNumberData from '@syncfusion/ej2-cldr-data/main/he/numbers.json';
import heTimeZoneData from '@syncfusion/ej2-cldr-data/main/he/timeZoneNames.json';
import heGregorian from '@syncfusion/ej2-cldr-data/main/he/ca-gregorian.json';
import numberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import {fieldsData} from "./utils.jsx";
import {calendarTranslations} from "./consts.jsx";

import './Calendar.scss';
import dayjs from "dayjs";

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE);
loadCldr(heNumberData, heTimeZoneData, heGregorian, numberingSystem);

L10n.load(calendarTranslations);

const Calendar = () => {
    const history = useHistory();
    const scheduleRef = useRef(null);
    const clickCountRef = useRef(0);
    const singleClickTimerRef = useRef(null);
    const {
        eventTemplate,
        onEventRendered
    } = useCalendarTemplates({scheduleRef});

    const handleSingleClick = (args) => {
        // Prevent default single-click behavior
        args.cancel = true;
    };

    const handleDoubleClick = (args) => {
        const {event} = args;
        if (event?.Id) {
            setTimeout(() => {
                history.push(`/admin/sessions/${event.Id}`);
            }, 50);
        }
    }

    const onEventClick = (args) => {
        clickCountRef.current++;
        if (clickCountRef.current === 1) {
            singleClickTimerRef.current = setTimeout(() => {
                handleSingleClick(args);
                clickCountRef.current = 0;
            }, 400);
        } else if (clickCountRef.current === 2) {
            clearTimeout(singleClickTimerRef.current);
            handleDoubleClick(args);
            clickCountRef.current = 0;
        }
    };

    const agendaDaysCount = 7;

    const onNavigating = (args) => {
        if (args.action === 'date' && scheduleRef?.current?.currentView === 'Agenda') {
            const previousDate = dayjs(args.previousDate).startOf('day');
            const targetDate = dayjs(args.currentDate).startOf('day');

            const daysDifference = targetDate.diff(previousDate, 'day');
            if (daysDifference === 1) {
                // Navigating forward by 7 days (next)
                args.currentDate = previousDate.add(agendaDaysCount, 'day').toDate();
            } else if (daysDifference === -1) {
                // Navigating backward by 7 days (previous)
                args.currentDate = previousDate.subtract(agendaDaysCount, 'day').toDate();
            } else {
                // Navigating to a specific date (direct selection)
                args.currentDate = targetDate.toDate();
            }
        }
    };

    return (
        <div className="Calendar">
            <PageHero loading={false} icon={iconsNames.calendar} header="יומן"/>
            <ScheduleComponent
                rowAutoHeight
                agendaDaysCount={agendaDaysCount}
                eventClick={onEventClick}
                popupOpen={(args) => {
                    args.cancel = true;
                }}
                eventRendered={onEventRendered}
                ref={scheduleRef}
                locale="he"
                width='100%'
                height='500px'
                selectedDate={new Date()}
                enableRtl
                readonly
                navigating={onNavigating}
                eventSettings={{
                    dataSource: dataManager,
                    fields: fieldsData,
                }}
            >
                <ViewsDirective>
                    <ViewDirective option='Agenda' isSelected enableLazyLoading eventTemplate={eventTemplate}/>
                    <ViewDirective option='Week' enableLazyLoading/>
                    <ViewDirective option='Month' enableLazyLoading/>
                    <ViewDirective option='TimelineMonth' enableLazyLoading/>
                </ViewsDirective>
                <Inject services={[Agenda, Week, Month, TimelineViews, TimelineMonth]}/>
            </ScheduleComponent>
        </div>
    );
};

export default Calendar;
