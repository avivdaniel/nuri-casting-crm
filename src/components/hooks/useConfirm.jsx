import {useEffect, useState} from "react";

export const useConfirm = () => {
    const [confirm, setConfirm] = useState(false);
    const [needsCleanup, setNeedsCleanup] = useState(false);

    const isConfirmed = (prompt) => {
        setNeedsCleanup(true);
        const promise = new Promise((resolve, reject) => {
            setConfirm({
                prompt,
                isOpen: true,
                proceed: resolve,
                cancel: reject
            });
        });
        return promise.then(
            () => {
                setConfirm(prevState => ({...prevState, isOpen: false}));
                return true;
            },
            () => {
                setConfirm(prevState => ({...prevState, isOpen: false}));
                return false;
            }
        );
    };
    useEffect(() => {
        return () => {
            if (confirm.cancel && needsCleanup) {
                confirm.cancel();
            }
        };
    }, [confirm, needsCleanup]);
    return {
        ...confirm,
        isConfirmed
    };
}
