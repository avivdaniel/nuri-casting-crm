import React, { useEffect } from "react";
import { Grid, Header, Segment, Tab } from "semantic-ui-react";
import ModelSizesTable from "./ModelSizesTable";
import { useModelDetailsContext } from "@/context/ModelDetailsContext.jsx";
import ModelDetailsCard from "./ModelDetailsCard";
import { MODEL_DETAILS_TABS } from "./tabs";

const ModelDetailsPage = ({ match }) => {
  const { api, model, setModel, loadingModel } = useModelDetailsContext();
  const modelId = match.params.id;

  useEffect(() => {
    api.getModel(modelId);
    return () => setModel(null);
  }, [modelId]);

  const tabs = MODEL_DETAILS_TABS.map(({ component, ...restTab }) => {
    return {
      ...restTab,
      render: () =>
          component && <Tab.Pane key={component.key}>{component}</Tab.Pane>,
    };
  });

  return (
      <>
        {model && (
            <>
              <Segment className="noprint" placeholder loading={loadingModel}>
                <Header>
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <ModelDetailsCard />
                      <Grid.Column width={6}>
                        <ModelSizesTable />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Header>
              </Segment>
              <Tab menu={{ attached: true }} panes={tabs} />
            </>
        )}
      </>
  );
};
export default ModelDetailsPage;
