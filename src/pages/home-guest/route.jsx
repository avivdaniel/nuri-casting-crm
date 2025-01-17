import React from 'react';

export const route  = {
    path: '/public',
    component: React.lazy(()=> import('./index.jsx')),
};