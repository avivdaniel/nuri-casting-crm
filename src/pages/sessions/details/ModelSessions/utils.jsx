import { AGENCYS_NAMES } from "../../../../components/Ui/ModelForm/constants.jsx";
import { formatTransportation } from "../../../../utils.jsx";

export const calcModelSessionDetails = (modelSessions) => {
  // Define mapping for transportation types
  const transportationMapping = {
    ללא: "without",
    הסעה: "with",
    איסוף: "pickup",
    עצמאית: "independent",
  };

  // Initialize counters
  const initialCounts = {
    female: 0,
    male: 0,
    without: 0,
    with: 0,
    pickup: 0,
    independent: 0,
    [AGENCYS_NAMES.Matan]: 0,
  };

  return modelSessions.reduce((counts, session) => {
    const {
      hasTransportation,
      model: { gender, agency },
    } = session;

    // Normalize gender and transportation keys
    const normalizedGender = gender.toLowerCase();
    const transportationKey =
      transportationMapping[formatTransportation(hasTransportation)];

    // Update counters
    counts[normalizedGender] += 1;
    counts[transportationKey] += 1;

    // Update agency count if it exists
    if (agency in counts) {
      counts[agency] += 1;
    }

    return counts;
  }, initialCounts);
};
