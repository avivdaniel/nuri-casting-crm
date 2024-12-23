const BANK_API_URL = 'https://data.gov.il/api/3/action/datastore_search';

const formatToFormData = (data) => {
    const formData = new FormData();

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            formData.append(key, value);
        }
    }

    return formData;
}

const formatBranchListToSelectOptions = (branchList) => {
    return branchList.map(branch => {
        return {value: branch.Branch_Code, label: `${branch.Branch_Code} - ${branch.Branch_Name}`}
    })
};

function fetchTotalResults(json) {
    if (json.result && json.result.total !== undefined) {
        return json.result.total;
    }
    return null;
}

export const getBankBranches = async ({bankNumber}) => {
    if (!bankNumber) return;

    try {
        async function fetchAllResults(apiURL, formData) {
            let results = [];
            let offset = formData.offset || 0;
            let total = null;
            let records = null;
            do {
                formData.offset = offset;
                const formDataObject = formatToFormData(formData);
                const response = await fetch(apiURL, {
                    method: 'POST',
                    body: formDataObject
                });
                const json = await response.json();
                total = fetchTotalResults(json);
                records = json.result.records;
                results = results.concat(records);
                offset += 100;
            } while (results.length < total);
            return results;
        }

        const formData = {
            resource_id: '1c5bc716-8210-4ec7-85be-92e6271955c2',
            filters: {
                Bank_Code: [bankNumber]
            },
        };
        const allResults = await fetchAllResults(BANK_API_URL, formData);
        return formatBranchListToSelectOptions(allResults);
    } catch (e) {
        console.error(e);
    }
};

export const nestBankProperties = (obj) => {
    const result = {};
    for (const key in obj) {
        if (key.startsWith('bank-')) {
            const newKey = key.replace('bank-', '');
            result.bank = result.bank || {};
            result.bank[newKey] = obj[key];
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

export const extractBankProperties = (obj) => {
    const result = {};
    for (const key in obj) {
        if (key === 'bank') {
            for (const bankKey in obj.bank) {
                result[`bank-${bankKey}`] = obj.bank[bankKey];
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};