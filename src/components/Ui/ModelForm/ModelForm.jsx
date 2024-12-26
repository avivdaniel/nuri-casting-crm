import {useState, useEffect} from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {useForm, FormProvider} from "react-hook-form";
import {updateDoc, addDoc,} from "@/services";
import {useModelDetailsContext} from "@/context/ModelDetailsContext";
import {extractBankProperties, nestBankProperties} from "@/services/banks";
import {COLLECTIONS} from "@/constants/collections";
import ModelFormFields from "./ModelFormFields";
import {modelFormDefaultValues} from "@/constants/createModelFormDefaultValues";
import {route as CreateModelRoute} from '@/pages/models/create/route.jsx'
import {route as DetailsModelRoute} from '@/pages/models/details/route.jsx'
import {route as AdminHomeRoute} from "@/pages/home-admin/route.jsx";


const ModelForm = () => {
    const {model, api, setModel, loadingModel} = useModelDetailsContext();
    const {id: idParam} = useParams();
    const location = useLocation();
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [backLink, setBackLink] = useState(AdminHomeRoute.path);
    const id = model?.id || idParam;

    const methods = useForm(modelFormDefaultValues);

    useEffect(() => {
        if (location.pathname !== CreateModelRoute.path)
            if (model) {
                // EDIT-MODEL -populate fields value at model details page
                const {
                    // birthday: modelBirthdayUnix,
                    ...restModelDetails
                } = extractBankProperties(model);
                // const formattedBirthday = modelBirthdayUnix ? new Date(modelBirthdayUnix * 1000) : new Date()
                Object.entries({
                    ...restModelDetails,
                    // birthday: formattedBirthday
                }).forEach(([key, value]) => methods.setValue(key, value));
            } else api.getModel(id) //EDIT-MODEL from models/:id/edit
    }, [model, location.pathname]);

    useEffect(() => {
        if (id) setBackLink(DetailsModelRoute.getPath(id));
    }, [id]);

    const createNewModel = async (modelData) => {
        const docRef = await addDoc(COLLECTIONS.models, {createdDate: Date.now(), isActive: true, ...modelData});
        setLoading(false)
        history.push(DetailsModelRoute.getPath(docRef.id));
    };

    const submit = async (modelData) => {
        setLoading(true);
        const {
            // birthday,
            ...formattedModelData
        } = nestBankProperties(modelData);
        // const formattedBirthday = formatBirthdayToUnix(birthday);
        if (id && location.pathname !== CreateModelRoute.path) {
            try {
                //UPDATE MODEL
                await updateDoc(COLLECTIONS.models, id, {
                    ...formattedModelData,
                    // birthday: formattedBirthday
                });
                setModel(
                    {
                        ...model,
                        ...formattedModelData,
                        // birthday: formattedBirthday
                    })
                setLoading(false)
                history.push(DetailsModelRoute.getPath(id));
            } catch (err) {
                alert(err);
                setLoading(false);
            }
        } else {
            try {
                //CREATE NEW MODEL
                //TODO: use same function also in the admin panel!!
                await createNewModel({
                    ...formattedModelData,
                    // birthday: formattedBirthday
                });
            } catch (err) {
                alert(err);
                setLoading(false)
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <ModelFormFields modelId={id} isLoading={isLoading || loadingModel} backLink={backLink} onSubmit={submit}/>
        </FormProvider>
    );
};

export default ModelForm;
