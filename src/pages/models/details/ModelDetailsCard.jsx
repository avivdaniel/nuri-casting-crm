import React from "react";
import {
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Message,
  Segment,
} from "semantic-ui-react";
import modelAvatar from "../../../assets/images/model-avatar.png";
import List from "semantic-ui-react/dist/commonjs/elements/List";
import { formatGender } from "../../../utils.jsx";
import { useModelDetailsContext } from "../../../context/ModelDetailsContext.jsx";

const ModelDetailsCard = () => {
  const { model } = useModelDetailsContext();

  return (
    <>
      {model && (
        <Grid.Column width={10}>
          <Divider horizontal>
            <Header as="h2">{model.name}</Header>
          </Divider>
          <Segment textAlign="center">
            <Label color={model?.isActive ? "green" : "yellow"} attached="top">
              {model?.isActive ? "פעיל" : "ארכיון"}
            </Label>
            <Grid>
              <Grid.Column width={6} verticalAlign="middle">
                <Image
                  src={model.image || modelAvatar}
                  className="image-prev"
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                <List className="text-right icon-right" size="huge">
                  <List.Item
                    icon="transgender alternate"
                    content={formatGender(model.gender)}
                  />

                  <List.Item icon="phone" content={model.phone} />

                  {model?.city && (
                    <List.Item
                      icon="map marker alternate"
                      content={model.city}
                    />
                  )}
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
          {!!model?.notes?.length && (
            <Segment>
              <Message warning>
                <Icon
                  name="exclamation triangle"
                  style={{ marginLeft: "10px", marginRight: "0px" }}
                />
                {model?.notes?.[model.notes.length - 1].text}
              </Message>
            </Segment>
          )}
        </Grid.Column>
      )}
    </>
  );
};

export default ModelDetailsCard;
