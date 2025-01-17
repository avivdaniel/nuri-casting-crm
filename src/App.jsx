import {useEffect, useState, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import {registerLocale} from "react-datepicker";
import {Dimmer, Loader} from "semantic-ui-react";
import {auth} from "./firebase";
import Login from "./pages/login/Login";
import {useExportAllModelsToExcel} from "@/ui/hooks/useExportAllModelsToExcel.jsx";
import {AppLoader, Navbar} from "@/ui/components";
import {ToastContextProvider} from "./context/ToastContext";
import {ModelDetailsContextProvider} from "./context/ModelDetailsContext.jsx";


import PagesRouter from "./pages/PagesRouter.jsx";
import {loadMessages, locale} from "devextreme/localization";
import heMessages from "./locale/hebrew.json";
import config from "devextreme/core/config";

import he from "date-fns/locale/he";
// Styles
import "react-datepicker/dist/react-datepicker.css";
import "semantic-ui-css/semantic.min.css";
import "./App.scss";

// Localization
registerLocale("he", he);
loadMessages(heMessages);
locale("he");
config({
    rtlEnabled: true,
});

const App = () => {
    const [loading, setLoading] = useState(true);
    const {loading: isExportingAllModels, exportModels} = useExportAllModelsToExcel();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="App">
            <Suspense fallback={<AppLoader/>}>
                {loading ? <AppLoader/> : <>
                    <Navbar user={user} exportModels={exportModels}/>
                    {isExportingAllModels && <Dimmer active inverted>
                        <Loader>מייצא את כל המיוצגים הנמצאים במערכת</Loader>
                    </Dimmer>}
                    <ToastContextProvider>
                        <ModelDetailsContextProvider>
                            <Switch>
                                <Route path="/login" component={Login}/>
                                <PagesRouter user={user}/>
                            </Switch>
                        </ModelDetailsContextProvider>
                    </ToastContextProvider>
                </>}
            </Suspense>
        </div>
    );
};

export default App;
