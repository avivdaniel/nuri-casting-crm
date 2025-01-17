import React from 'react';
import {route as publicHomeRoute} from "@/pages/home-guest/route.jsx";

export const route = {
    path: `${publicHomeRoute.path}/create-model`,
    component: React.lazy(() => import('./index.jsx')),
}