import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';

import App from './App.jsx'

/**
 * Suppress specific warnings in the console caused by the migration to React 18.
 *
 * During the migration from Create React App (CRA) to Vite with React 18,
 * some components in the Semantic UI library still rely on deprecated
 * `defaultProps` for function components, which triggers warnings in the console.
 *
 * Since the library cannot be upgraded, this override temporarily filters out
 * these warnings to avoid cluttering the developer console.
 *
 * NOTE: This suppression should only be used in development and avoided
 * in production. The warning does not affect application functionality.
 */

const originalConsoleError = console.error;
console.error = (message, ...messageArgs) => {
    // console.log({message, messageArgs}); // uncomment only to see what arguments you receive
    if (
        messageArgs[1] &&
        message.includes("Support for defaultProps will be removed from function components")
    ) {
        return
    }
    originalConsoleError(message, ...messageArgs);
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>,
)
