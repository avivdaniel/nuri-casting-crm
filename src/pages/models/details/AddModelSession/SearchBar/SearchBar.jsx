import React, {forwardRef, useCallback} from "react";
import debounce from 'lodash.debounce';
import AsyncSelect from "react-select/async";
import dayjs from "dayjs";

const SESSIONS_PER_PAGE = 10;

export const SearchBar = forwardRef(({onChange, onSearchSubmit}, ref) => {
    const debouncedSearch = useCallback(
        debounce((inputValue, callback) => {
            onSearchSubmit(inputValue, SESSIONS_PER_PAGE)
                .then((sessions) => {
                    const options = sessions.map((session) => ({
                        ...session,
                        value: session.id,
                        label: `${session.production}, ${dayjs(session.date).format("DD/MM/YYYY")}`,
                    }));
                    callback(options);
                })
                .catch(() => {
                    callback([]);
                });
        }, 300),
        [onSearchSubmit]
    );

    const loadOptions = (inputValue, callback) => {
        if (!inputValue) {
            return callback([]);
        }
        debouncedSearch(inputValue, callback);
    };

    const handleOnChange = (data) => {
        onChange(data);
    };

    return (
        <AsyncSelect
            ref={ref}
            onChange={handleOnChange}
            cacheOptions
            defaultOptions
            loadingMessage={() => "טוען ימי צילום..."}
            noOptionsMessage={() => "לא נמצאו תוצאות"}
            loadOptions={loadOptions}
            placeholder=""
        />
    );
});