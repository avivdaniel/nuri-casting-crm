import {useMemo} from "react";
import {Route, Switch} from "react-router-dom";
import {adminRoutes, guestRoutes} from "./routes.jsx";
import {route as homeAdminRoute} from "./home-admin/route.jsx";
import {route as homeGuestRoute} from "./home-guest/route.jsx";
import {Container} from "semantic-ui-react";

const renderRoutes = (routes) => {
    return routes.map(({path, component, exact = true}, index) => {
        return (
            <Route key={index} exact={exact} path={path} component={component}/>
        );
    });
};

const PagesRouter = ({user}) => {
    const adminRoutesComp = useMemo(()=> renderRoutes(adminRoutes),[]);
    const guestRoutesComp = useMemo(()=> renderRoutes(guestRoutes),[]);

    return (
        <Container>
            {user ? (
                <Route path={homeAdminRoute.path}>
                    <Switch>
                        {adminRoutesComp}
                    </Switch>
                 </Route>
            ) : (
                <Route path={homeGuestRoute.path}>
                    <Switch>
                        {guestRoutesComp}
                    </Switch>
                </Route>
            )}
        </Container>
    );
};

export default PagesRouter;
