import React, {useState} from 'react';
import {Input , Button} from "semantic-ui-react";
import {useModelDetailsContext} from "../../../context/ModelDetailsContext.jsx";

export const Commission = () => {
    const {model, api, loadingModel} = useModelDetailsContext();
    const [commission, setCommission] = useState('');

    const updateModelCommission = async () => {
        try {
            await api.updateModel(model.id, {
                commission
            });
            alert('העמלה עודכנה בהצלחה')
        } catch (err) {
            err.code === 'permission-denied' ? alert('אין לך הרשאה לעדכן ערך זה') : alert(err);
        }
    };

    return (
        <div>
            <Input
                name="commission"
                onChange={(e) => {
                    setCommission(e.target.value)
                }}
                type="number"
                placeholder="הכנס אחוז"
            />

            <Button positive loading={loadingModel} disabled={loadingModel} onClick={async ()=> {
                    await updateModelCommission();
            }}>עדכן</Button>

            <p>עמלה נוכחית: {model?.commission || 'לא הוגדרה עמלה'}%</p>
        </div>
    );
};