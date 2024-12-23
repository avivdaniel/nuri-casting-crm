import * as React from 'react';

import {useController} from "react-hook-form";
import {Label} from "semantic-ui-react";
import DatePicker from "react-datepicker";


export const CustomDatePicker = ({label = '', name, control, options, defaultValue, error, rules, ...rest}) => {
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
            <DatePicker
                {...rest}
                {...field}
                locale="he"
                dateFormat="dd/MM/yyyy"
                selected={field.value}
                showYearDropdown
                showMonthDropdown
            />
            {error?.content && <Label basic color='red' pointing='above'>
                {error?.content}
            </Label>}
        </>
    );
};