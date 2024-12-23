import React from "react";
import { Segment } from "semantic-ui-react";

export const Footer = () => {
  return (
    <footer style={{ position: "fixed", bottom: 0, width: "100%", height: 50 }}>
      <Segment inverted textAlign="center" style={{ padding: "1em 0em" }}>
        <p>כל הזכויות שמורות</p>
      </Segment>
    </footer>
  );
};
