import React, {useCallback} from "react";
import debounce from 'lodash.debounce';
import AsyncSelect from "react-select/async";
import {components} from 'react-select';
import modelAvatar from "../../../../../assets/images/model-avatar.png";

import './SearchBar.scss';

const MODELS_PER_PAGE = 10;

export const SearchBar = ({onChange, onSearchSubmit}) => {
    const debouncedSearch = useCallback(
        debounce((inputValue, callback) => {
            onSearchSubmit(inputValue, MODELS_PER_PAGE)
                .then((models) => {
                    const options = models.map((model) => ({
                        value: model.id,
                        label: model.name,
                        image: model.image || modelAvatar
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
        onChange(data)
    }
    const customOption = ({data, ...rest}) => {
        return <div className="custom-option">
            <img
                src={data.image}
                alt={data.label}
            />
            <components.Option data={data} {...rest} />
        </div>
    };

    return (
        <AsyncSelect
            onChange={handleOnChange}
            cacheOptions
            defaultOptions
            loadingMessage={() => "טוען מיוצגים..."}
            noOptionsMessage={() => "לא נמצאו תוצאות"}
            placeholder="הקלד שם מיוצג..."
            loadOptions={loadOptions}
            components={{Option: customOption}}
        />
    );
};
