import * as React from 'react';
import { Label } from 'semantic-ui-react';

// A separate function to handle label rendering
const getLabels = (session) => {
    const labels = [];

    if (session?.isPostponement) {
        labels.push({ color: 'red', text: 'נדחה' });
    }

    if (session?.isExternalProduction) {
        labels.push({ color: 'yellow', text: 'הפקה חיצונית' });
    }

    //TODO: bring back if needed in the feature
    
    // if (isEveryoneTransported) {
    //     labels.push({ color: 'green', text: 'הסעה הושלמה' });
    // }

    return labels;
};

const checkIsEveryoneTransported = (modelSessions = []) => modelSessions.every(modelSession => modelSession.hasTransportation !== 'ללא');

const SessionLabels = ({ session, modelSessions }) => {
    // const [isEveryoneTransported, setIsEveryoneTransported] = useState(checkIsEveryoneTransported(modelSessions))
    const labels = getLabels(session);

    // useEffect(()=> {
    //     setIsEveryoneTransported(checkIsEveryoneTransported(modelSessions))
    // },[modelSessions]);

    return (
        <div className="labels-container">
            {labels.map((label, index) => (
                <Label key={index} color={label.color}>
                    {label.text}
                </Label>
            ))}
        </div>
    );
};

export default SessionLabels;
