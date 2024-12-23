import React, {useCallback} from 'react';
import {useMemo} from 'react';
import {Link} from 'react-router-dom';

const checkMarkButton = '\u2705';

export const useCalendarTemplates = ({scheduleRef}) => {
    const eventTemplate = (props) => {

        return (
            <div className="template-wrap">
                <div className="subject">
                    {props.isAllModelSessionsTransported && <span className="checkMarkButton">{checkMarkButton}</span>}
                    {props.Subject}
                </div>
            </div>
        );
    };

    const applyCategoryColor = useCallback((args, currentView) => {
        const categoryColor = args.data.PrimaryColor;
        if (!args.element || !categoryColor) return;

        const elementStyle = args.element.style;
        if (currentView === 'Agenda') {
            Object.assign(elementStyle, { padding: '5px 0' });
            Object.assign(args.element.firstChild.style, {
                borderRightColor: categoryColor,
                backgroundColor: categoryColor,
                width: '100%',
                flexDirection: 'row',
                padding: '20px 10px',
                color: 'white',
                cursor: 'pointer'
            });
        } else {
            elementStyle.backgroundColor = categoryColor;
        }
    }, []);

    const onEventRendered = useCallback(
        (args) => {
            if (scheduleRef.current) {
                applyCategoryColor(args, scheduleRef.current.currentView);
            }
        },
        [applyCategoryColor, scheduleRef]
    );

    return {
        eventTemplate,
        onEventRendered,
    };
};
