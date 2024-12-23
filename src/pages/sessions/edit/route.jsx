import React from 'react';
import {route as adminHomeRoute} from "@/pages/home-admin/route.jsx";

export const route = {
    path: `${adminHomeRoute.path}/:sessionId/edit`,
    component: React.lazy(()=> import('./index.jsx')),
}