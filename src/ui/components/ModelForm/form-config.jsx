import {
  AGENCY_OPTIONS,
  BANKS_OPTIONS,
  GENDER_OPTIONS,
  SHIRT_SIZE_OPTIONS,
} from "./constants";

export const formConfig = [
  {
    section: "פרטים אישיים",
    groups: [
      {
        id: "group-1",
        fields: [
          {
            label: "שם + שם משפחה",
            name: "name",
            type: "text",
            placeholder: "שם פרטי ושם משפחה",
            validation: {
              required: "שם מלא הוא שדה חובה",
              trimOnBlur: true,
            },
          },
          {
            label: 'ת"ז (או דרכון במידה ואין ת״ז ישראלית)',
            name: "idNumber",
            type: "text",
            placeholder: "תעודת זהות",
            maxLength: 9,
            validation: {
              required: "תעודת זהות הוא שדה חובה",
            },
          },
          {
            label: "מין",
            placeholder: "מין",
            name: "gender",
            type: "select",
            options: GENDER_OPTIONS,
            validation: {
              required: "מין הוא שדה חובה",
            },
          },
          {
            label: "טלפון",
            name: "phone",
            type: "text",
            placeholder: "טלפון",
            maxLength: 10,
            validation: {
              required: "טלפון הוא שדה חובה",
              pattern: {
                value: /^0\d([\d]{0,1})([-]{0,1})\d{7}$/,
                message: "מספר טלפון לא תקין",
              },
            },
          },
        ],
      },
      {
        id: "group-2",
        widths: 3,
        fields: [
          {
            label: "מספר ווצאפ (למלא רק אם המספר שונה ממספר הטלפון)",
            name: "whatsapp",
            type: "text",
            placeholder: "ווצאפ",
            maxLength: 10,
            pattern: {
              value: /^0\d([\d]{0,1})([-]{0,1})\d{7}$/,
              message: "מספר ווצאפ לא תקין",
            },
          },
          {
            label: "עיר מגורים",
            name: "city",
            type: "text",
            placeholder: "עיר מגורים",
            validation: {
              required: "עיר מגורים הוא שדה חובה",
              trimOnBlur: true,
            },
          },
        ],
      },
    ],
  },
  {
    section: "מידות",
    groups: [
      {
        id: "group-3",
        fields: [
          {
            label: "גובה",
            name: "height",
            type: "text",
            placeholder: "גובה",
            maxLength: 3,
            validation: {
              required: "גובה הוא שדה חובה",
              min: { value: 120, message: "ערך מינימום 120" },
              max: { value: 220, message: "ערך מקסימום 220" },
              pattern: {
                value: /^[0-9]+$/,
                message: "גובה יכול להכיל מספרים בלבד",
              },
            },
          },
          {
            label: "מידת חולצה",
            placeholder: "מידת חולצה",
            name: "shirtSize",
            type: "select",
            options: SHIRT_SIZE_OPTIONS,
            validation: {
              required: "מידת חולצה היא שדה חובה",
            },
          },
          {
            label: "מידת מכנסיים",
            name: "pantsSize",
            type: "text",
            placeholder: "מידת מכנסיים",
            maxLength: 2,
            validation: {
              required: "מידת מכנסיים הוא שדה חובה",
              pattern: {
                value: /^[0-9]+$/,
                message: "מכנסיים הוא שדה מספרים בלבד",
              },
              minLength: {
                value: 2,
                message: "שדה מכנסיים מכיל 2 ספרות בלבד",
              },
            },
          },
          {
            label: "מידת נעליים",
            name: "shoeSize",
            type: "text",
            placeholder: "מידת נעליים",
            maxLength: 2,
            validation: {
              required: "מידת נעליים הוא שדה חובה",
              pattern: {
                value: /^[0-9]+$/,
                message: "נעליים הוא שדה מספרים בלבד",
              },
              min: {
                value: 20,
                message: "ערך מידת נעליים מעל 20",
              },
              max: {
                value: 70,
                message: "ערך מידת נעליים מתחת ל70",
              },
              minLength: {
                value: 2,
                message: "שדה נעליים מכיל 2 ספרות בלבד",
              },
            },
          },
        ],
      },
    ],
  },
  {
    section: "כללי",
    groups: [
      {
        id: "group-4",
        widths: 4,
        fields: [
          {
            label: "סוכנות",
            name: "agency",
            type: "select",
            placeholder: "בחר סוכנות",
            options: AGENCY_OPTIONS.filter((agency) => agency.isActive),
            validation: {
              required: "שם סוכנות שדה חובה",
            },
          },
        ],
      },
    ],
  },
  {
    section: "פרטי חשבון בנק",
    groups: [
      {
        id: "group-5",
        fields: [
          {
            label: "בנק",
            name: "bank-bank_number",
            type: "select",
            placeholder: "מספר הבנק",
            options: BANKS_OPTIONS,
          },
          {
            label: "סניף",
            name: "bank-branch_number",
            type: "custom-creatable-select",
            placeholder: "סניף",
          },
          {
            label: "מספר חשבון",
            name: "bank-account_number",
            type: "text",
            placeholder: "הקלד מספר חשבון",
          },
          {
            label: "שם המוטב",
            name: "bank-account_owner",
            type: "text",
            placeholder: "הקלד את שם המוטב",
          },
        ],
      },
    ],
  },
];
