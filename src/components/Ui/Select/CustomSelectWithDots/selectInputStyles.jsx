import {addErrorStylesToSelectInput} from "../selectInputStylesHelpers";

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginLeft: 8,
        height: 15,
        width: 15,
    },
});

export const colourStyles = (error = false) => ({
    control: (styles) => ({
        ...styles,
        backgroundColor: 'white',
        ...addErrorStylesToSelectInput(error),
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = data.color;
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? color
                    : isFocused
                        ? `${color}1A`
                        : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? 'white'
                    : color,
            cursor: isDisabled ? 'not-allowed' : 'default',
            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? color
                        : `${color}30`
                    : undefined,
            },
        };
    },
    input: (styles) => ({...styles, ...dot()}),
    placeholder: (styles) => ({...styles, ...dot('#ccc')}),
    singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
});
