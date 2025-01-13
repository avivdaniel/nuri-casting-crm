import * as React from 'react';
import {useController} from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import {addErrorStylesToSelectInput} from '../utils.jsx';
import {Label} from "semantic-ui-react";

export const CustomCreatableSelect = ({label = '', name, control, options, defaultValue, error, rules, ...rest}) => {
    const {
        field,
    } = useController({
        name,
        control,
        defaultValue,
        rules
    });

    return (
        <>
            {label && <label>{label}</label>}
            <CreatableSelect
                {...rest}
                {...field}
                name={name}
                value={options.find((option) => option.value === field.value)}
                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                options={options}
                styles={{
                    control: base => ({
                        ...base,
                        ...addErrorStylesToSelectInput(error)
                    })
                }}
            />
            {error?.content && <Label basic color='red' pointing='above'>
                {error?.content}
            </Label>}
        </>
    );
};