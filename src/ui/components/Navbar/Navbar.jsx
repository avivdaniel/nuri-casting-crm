import {Button, Dropdown, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {signOut} from "firebase/auth";
import {auth} from "@/firebase/index.jsx";

import {route as HomeTasksRoute} from '@/pages/tasks/home/route.jsx'
import {route as CalendarRoute} from '@/pages/calendar/route.jsx'
import {route as CreateModelRoute} from '@/pages/models/create/route.jsx'
import {route as SearchActiveModelsRoute} from '@/pages/models/search-active/route.jsx'
import {route as SearchArchiveModelsRoute} from '@/pages/models/search-archive/route.jsx'
import {route as CreateSessionRoute} from '@/pages/sessions/create/route.jsx'
import {route as SearchSessionRoute} from '@/pages/sessions/search/route.jsx'


export const Navbar = ({user, exportModels}) => {
    return (
        <Menu className="noprint" color="blue" inverted pointing>
            {user ? (
                <>
                    <Menu.Item>שלום, {user.displayName}!</Menu.Item>
                    <Menu.Item as={Link} to="/admin">
                        מסך הבית
                    </Menu.Item>
                    <Menu.Item as={Link} to={CalendarRoute.path}>
                        יומן
                    </Menu.Item>
                    <Menu.Item as={Link} to={HomeTasksRoute.path}>
                        משימות
                    </Menu.Item>
                    <Dropdown item text=" מיוצגים ">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={CreateModelRoute.path}
                                style={{textAlign: "center"}}
                            >
                                צור מיוצג חדש
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={SearchActiveModelsRoute.path}
                                style={{textAlign: "center"}}
                            >
                                חפש מיוצגים פעילים
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={SearchArchiveModelsRoute.path}
                                style={{textAlign: "center"}}
                            >
                                חפש מיוצגים בארכיון
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={exportModels}
                                style={{textAlign: "center"}}
                            >
                                ייצוא כל המיוצגים
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown item text=" ימי צילום ">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={CreateSessionRoute.path}
                                style={{textAlign: "center"}}
                            >
                                צור יום צילום חדש
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Link}
                                to={SearchSessionRoute.path}
                                style={{textAlign: "center"}}
                            >
                                חפש ימי צילום
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item position="left">
                        <Button inverted onClick={() => signOut(auth)}>
                            התנתק
                        </Button>
                    </Menu.Item>
                </>
            ) : <Menu.Item as={Link} position="left" to="/login">
                התחברות
            </Menu.Item>}
        </Menu>
    );
};
