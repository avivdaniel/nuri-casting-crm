import * as React from 'react';
import Select from "react-select";
import {Label} from "semantic-ui-react";
import {useController} from "react-hook-form";
import {colourStyles} from "./utils.jsx";


export const CustomSelectWithDots = ({label = '', name, control, options, defaultValue, error, rules, ...rest}) => {
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
            <Select
                {...rest}
                {...field}
                name={name}
                value={options.find((option) => option.value === field.value)}
                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                options={options}
                styles={{
                    ...colourStyles(error),
                }}
            />
            {error?.content && <Label basic color='red' pointing='above'>
                {error?.content}
            </Label>}
        </>
    );
};