import React from "react";
import PropTypes from "prop-types";
import { Label } from "semantic-ui-react";

import { AGENCYS_NAMES } from "../ModelForm/constants";
import { sessionDetailsTranslations } from "../../../constants/sessionDetailsTranslations";

import IconAvoid from "../../../assets/icons/no-stopping.png";
import IconBus from "../../../assets/icons/school-bus.png";
import IconPerson from "../../../assets/icons/public-transport.png";
import IconMan from "../../../assets/icons/man.jpeg";
import IconMan2 from "../../../assets/icons/man2.jpeg";
import IconWoman from "../../../assets/icons/woman.jpeg";
import IconPickup from "../../../assets/icons/pickup.png";

import "./SessionLabels.scss";

const iconName = {
  without: IconAvoid,
  with: IconBus,
  independent: IconPerson,
  female: IconWoman,
  male: IconMan,
  pickup: IconPickup,
  [AGENCYS_NAMES.Matan]: IconMan2,
};

const SessionLabel = ({ icon = "person", text, print, count = 0 }) => {
  return (
    <Label
      image
      className={["SessionLabels", !print && "noprint"]
        .filter(Boolean)
        .join(" ")}
    >
      <img src={iconName[icon]} alt={text} />
      {sessionDetailsTranslations[text] + " " + count}
    </Label>
  );
};

export default SessionLabel;

SessionLabel.propTypes = {
  icon: PropTypes.oneOf(Object.keys(iconName)),
  text: PropTypes.oneOf(Object.keys(sessionDetailsTranslations)),
  print: PropTypes.bool,
  count: PropTypes.number,
};
