import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export const PageLoader = () => (
  <div>
    <Dimmer active inverted>
      <Loader size="large">Loading</Loader>
    </Dimmer>
  </div>
);
