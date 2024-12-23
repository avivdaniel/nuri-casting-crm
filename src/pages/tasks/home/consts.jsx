export const TASK_STATUS = {
    pending: {label: 'ממתין לביצוע', value: 'pending', color: '#4B5563'}, // Lighter gray
    in_progress: {label: 'בתהליך', value: 'in_progress', color: '#D97706'}, // Lighter orange
    completed: {label: 'בוצע', value: 'completed', color: '#22C55E'}, // Green (unchanged)
};

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

export const STATUS_FILTER_DEFAULT_VALUE = [TASK_STATUS.pending.value, TASK_STATUS.in_progress.value]

export const STATUS_COLOR = {
    [TASK_STATUS.pending.value]: 'grey',
    [TASK_STATUS.in_progress.value]: 'orange',
    [TASK_STATUS.completed.value]: 'green',
};

export const EMPLOYEES = {
    nuri: {label: 'נורי', value: 'nuri'},
    shaked: {label: 'שקד', value: 'shaked'},
    ilay: {label: 'איליי', value: 'ilay'},
    none: {label: 'ללא ממונה', value: 'none'},
};
export const EMPLOYEES_VALUES = Object.values(EMPLOYEES)

export const CREATE_TASK_DEFAULT_VALUE = {status: TASK_STATUS.pending.value, description: '', documents: []};

