export const AGENCYS_NAMES = {
  Image: "Image models",
  Buzz: "Buzz media",
  You: "U management",
  Matan: "Matan",
  Take2: "Take 2",
  Atar: "Atar",
  Nuri: "Nuri Casting",
  Other: "אחר",
};

export const AGENCYS_TRANSLATIONS = {
  [AGENCYS_NAMES.Matan]: "מתן",
  [AGENCYS_NAMES.Nuri]: "נורי קאסטינג",
  [AGENCYS_NAMES.Atar]: "עטר",
};

export const AGENCY_OPTIONS = [
  {
    value: AGENCYS_NAMES.Take2,
    label: AGENCYS_NAMES.Take2,
    isActive: true,
  },
  { value: AGENCYS_NAMES.Image, label: AGENCYS_NAMES.Image, isActive: true },
  {
    value: AGENCYS_NAMES.Nuri,
    label: AGENCYS_TRANSLATIONS[AGENCYS_NAMES.Nuri],
    isActive: true,
  },
  {
    value: AGENCYS_NAMES.Matan,
    label: AGENCYS_TRANSLATIONS[AGENCYS_NAMES.Matan],
    isActive: true,
  },
  {
    value: AGENCYS_NAMES.Atar,
    label: AGENCYS_TRANSLATIONS[AGENCYS_NAMES.Atar],
    isActive: false,
  },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "זכר" },
  { value: "female", label: "נקבה" },
];

export const SHIRT_SIZE_OPTIONS = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "XXXL", label: "XXXL" },
];

export const COVID_STATUS = ["תו ירוק בתוקף", "ללא תו ירוק"];

export const BANKS_OPTIONS = [
  {
    label: 'בנק יהב לעובדי המדינה בע"מ',
    value: "4",
  },
  {
    label: "בנק הדואר",
    value: "9",
  },
  {
    label: 'בנק לאומי לישראל בע"מ',
    value: "10",
  },
  {
    label: 'בנק דיסקונט לישראל בע"מ',
    value: "11",
  },
  {
    label: 'בנק הפועלים בע"מ',
    value: "12",
  },
  {
    label: 'בנק אגוד לישראל בע"מ',
    value: "13",
  },
  {
    label: 'בנק אוצר החייל בע"מ',
    value: "14",
  },
  {
    label: 'בנק מרכנתיל דיסקונט בע"מ',
    value: "17",
  },
  {
    label: 'הבנק הדיגיטלי הראשון (בהקמה) בע"מ',
    value: "18",
  },
  {
    label: 'בנק מזרחי טפחות בע"מ',
    value: "20",
  },
  {
    label: "Citibank N.A",
    value: "22",
  },
  {
    label: "HSBC  Bank plc",
    value: "23",
  },
  {
    label: 'יובנק בע"מ',
    value: "26",
  },
  {
    label: "Barclays Bank PLC",
    value: "27",
  },
  {
    label: 'בנק למסחר בע"מ (לבנק מונה מפרק זמני)',
    value: "30",
  },
  {
    label: 'הבנק הבינלאומי הראשון לישראל בע"מ',
    value: "31",
  },
  {
    label: 'בנק ערבי ישראלי בע"מ',
    value: "34",
  },
  {
    label: "SBI State Bank of India",
    value: "39",
  },
  {
    label: 'בנק מסד בע"מ',
    value: "46",
  },
  {
    label: 'מרכז סליקה בנקאי בע"מ',
    value: "50",
  },
  {
    label: 'בנק פועלי אגודת ישראל בע"מ',
    value: "52",
  },
  {
    label: 'בנק ירושלים בע"מ',
    value: "54",
  },
  {
    label: 'שירותי בנק אוטומטיים בע"מ',
    value: "59",
  },
  {
    label: 'חסך קופת חסכון לחינוך בע"מ, חיפה',
    value: "65",
  },
  {
    label: 'בנק דקסיה ישראל בע"מ',
    value: "68",
  },
  {
    label: "בנק ישראל",
    value: "99",
  },
].map((bank) => ({ ...bank, label: `${bank.value} - ${bank.label}` }));
