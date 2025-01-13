import dayjs from "dayjs";

export const formatTransportation = (transportationValue) => {
        let defalutValue = "ללא";
    switch (transportationValue) {
        case "ללא":
            break;
        case "עצמאית":
            defalutValue = "עצמאית";
            break;
        case "הסעה":
            defalutValue = "הסעה";
            break;
            case "איסוף":
            defalutValue = "איסוף";
            break;
        case false:
            defalutValue = "עצמאית";
            break;
        case true:
            defalutValue = "הסעה";
            break;
        default:
            defalutValue = "ללא";
    }

    return defalutValue;
}

export const formatGender = (gender = '') => {
    return gender.toLowerCase() === 'male' ? 'זכר' : 'נקבה';
}

export const calculateCommission = (commission, payment) => {
    if (!commission) {
        return payment;
    }
    return payment - ((commission/ 100) * payment).toFixed(2);
}

export const formatDisplayDate = (date) => dayjs(date).format("DD/MM/YYYY");

export const formatBirthdayToUnix = (birthday) => {
    if (!birthday) return '';
    return dayjs(birthday).unix();
};

export const getAgeFromUnix = (unixTimeStamp) => {
    if (!unixTimeStamp) return '';
    const ageInSeconds = dayjs().unix() - unixTimeStamp;
    const ageInYears = dayjs(ageInSeconds * 1000).year() - 1970; // convert milliseconds to seconds
    return ageInYears;
};