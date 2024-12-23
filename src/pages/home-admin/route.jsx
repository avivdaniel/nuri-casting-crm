import React from 'react';

export const route  = {
    path: '/admin',
    component: React.lazy(()=> import('./index.jsx')),
};