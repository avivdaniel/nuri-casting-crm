import {useState} from 'react';
import {useHistory} from "react-router-dom";
import {useForm, FormProvider} from "react-hook-form";
import {ThanksModal} from "./ThanksModal";
import ModelFormFields from "../../components/Ui/ModelForm/ModelFormFields";
import {addDoc, nestBankProperties} from "../../services";
import {COLLECTIONS} from "../../constants/collections";
import {modelFormDefaultValues} from "../../constants/createModelFormDefaultValues";

export default () => {
    const history = useHistory();
    const methods = useForm(modelFormDefaultValues);
    const [isLoading, setIsLoading] = useState(false);
    const [showThanks, setShowThanks] = useState(false);

    const onSubmit = async (modelData) => {
        const {birthday, ...formattedModelData} = nestBankProperties(modelData);
        // const formattedBirthday = formatBirthdayToUnix(birthday);
        setIsLoading(true);
        try {
            //TODO: use same function also in the admin panel!!
            await addDoc(COLLECTIONS.models, {
                createdDate: Date.now(),
                isActive: true,
                // birthday: formattedBirthday,
                ...formattedModelData
            })
            setShowThanks(true);
            setIsLoading(false)
        } catch (e) {
            alert('שליחת הטופס נכשלה, נא ליצור קשר עם אדמין.')
            setShowThanks(false);
            setIsLoading(false);
        }
    };

    return <FormProvider {...methods}>
        <ThanksModal open={showThanks} onClose={() => history.push("/public")}/>
        <ModelFormFields isLoading={isLoading} backLink="/public" onSubmit={onSubmit}/>
    </FormProvider>
}