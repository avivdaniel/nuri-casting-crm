import Radio from "semantic-ui-react/dist/commonjs/addons/Radio";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Input,
  Message,
  Segment,
  Table,
} from "semantic-ui-react";
import { deleteDoc, getModels, updateDoc } from "../../../services";
import { PageHero } from "../index";
import Model from "./Model/Model";
import useStickyState from "../../hooks/useStickyState";
import { iconsNames } from "../CardGroups/consts";
import { COLLECTIONS } from "../../../constants/collections";

const MODELS_PER_PAGE = 10;

const SearchModels = ({ searchActiveModels, searchTitle, stickyStateName }) => {
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useStickyState([], stickyStateName);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchParameter, setSearchParameter] = useState("name");
  const [showMore, setShowMore] = useState(MODELS_PER_PAGE);

  const fetchModels = async () => {
    setError("");
    if (!query) {
      setError("נא הזן לפחות אות אחת לחיפוש");
      return;
    }
    setLoading(true);
    try {
      const result = await getModels(
        searchParameter,
        query,
        searchActiveModels,
        showMore,
      );
      setLoading(false);
      setModels(result);
      if (result.length === 0) {
        setError("לא נמצאו תוצאות");
      }
    } catch (err) {
      console.log(err);
      setError("בעיה בחיבור אנא נסה שנית");
      setLoading(false);
    }
  };

  const deleteModel = async (modelId) => {
    if (window.confirm("למחוק את המיוצג?")) {
      await deleteDoc("models", modelId);
      await fetchModels();
    }
  };

  const toggleArchiveModel = async (model) => {
    if (!model?.id) return;
    setLoading(true);
    try {
      await updateDoc(COLLECTIONS.models, model.id, {
        isActive: !model?.isActive,
      });
      await fetchModels();
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => query && (await fetchModels()))();
  }, [showMore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchModels();
  };

  return (
    <>
      <PageHero icon={iconsNames.search_model} header={searchTitle} />
      <Segment>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group>
            <Form.Field width={8}>
              <Input
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`חיפוש מיוצגים לפי שם`}
                fluid
              />
            </Form.Field>
            <Form.Field width={2}>
              <Radio
                checked={searchParameter === "city"}
                onClick={() => setSearchParameter("city")}
                value="city"
                toggle
                disabled={isLoading}
                label="לפי עיר"
              />
              <Radio
                checked={searchParameter === "name"}
                onClick={() => setSearchParameter("name")}
                value="name"
                toggle
                disabled={isLoading}
                label="לפי שם"
              />
            </Form.Field>
            <Form.Field width={6}>
              <Grid columns={2}>
                <Grid.Column>
                  <Button
                    color="blue"
                    fluid
                    disabled={isLoading || !query}
                    loading={isLoading}
                    type="submit"
                  >
                    חפש
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  <Button
                    fluid
                    disabled={isLoading}
                    as={Link}
                    to="/admin/create-model"
                    color="green"
                  >
                    צור מיוצג
                  </Button>
                </Grid.Column>
              </Grid>
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
      {error ? (
        <Message error content={error} />
      ) : (
        <>
          {models.length > 0 && (
            <Segment loading={isLoading}>
              <Header>
                <Message
                  success
                  content={`נמצאו ${
                    models.length >= showMore * 1 ? "מעל" : ""
                  } ${models.length} תוצאות:`}
                />
              </Header>
              <Table
                unstackable
                selectable
                textAlign="center"
                verticalAlign="middle"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>שם מלא</Table.HeaderCell>
                    <Table.HeaderCell>מין</Table.HeaderCell>
                    <Table.HeaderCell>טלפון</Table.HeaderCell>
                    <Table.HeaderCell>פעולות</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <>
                    {models.map((model) => (
                      <Model
                        key={model.id}
                        toggleArchiveModel={toggleArchiveModel}
                        deleteModel={deleteModel}
                        model={model}
                      />
                    ))}
                  </>
                </Table.Body>
              </Table>
              <Button
                color="green"
                disabled={models.length < showMore * 1}
                onClick={() => {
                  setShowMore(showMore + MODELS_PER_PAGE);
                }}
              >
                הצג עוד מיוצגים
              </Button>
            </Segment>
          )}
        </>
      )}
    </>
  );
};

export default SearchModels;
