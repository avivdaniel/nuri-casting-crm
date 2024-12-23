import React, {useCallback, useContext, useState} from 'react';
import {Toast} from "devextreme-react";

const ToastContext = React.createContext({});

export const ToastContextProvider = ({children}) => {
    const [toastConfig, setToastConfig] = useState({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const onHiding = useCallback(() => {
        setToastConfig({
            ...toastConfig,
            isVisible: false,
        });
    }, [toastConfig, setToastConfig]);

    return <ToastContext.Provider value={{setToastConfig}}>
        <Toast
            rtlEnabled
            visible={toastConfig.isVisible}
            message={toastConfig.message}
            type={toastConfig.type}
            onHiding={onHiding}
            displayTime={1500}
        />
        {children}
    </ToastContext.Provider>
};

export const useToastContext = () => useContext(ToastContext)