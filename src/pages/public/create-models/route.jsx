import {lazy} from 'react';
export const path = '/public/create-model';
export const component = lazy(()=>import('./index.jsx'))