import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import saveAs from "file-saver";
import JSZip from "jszip";
import {
  Header,
  Message,
  Segment,
  Table,
  Button,
  Icon,
  Checkbox,
  Dropdown,
  MenuMenu,
  Menu,
  Input,
} from "semantic-ui-react";
import { deleteDoc, mapAsync, updateModelSession } from "../../../../services/index.jsx";
import ModelSession from "../ModelSession/ModelSession.jsx";
import SessionLabel from "@/ui/components/SessionLabels/SessionLabel.jsx";
import { useSelectTableRows } from "@/ui/hooks/useSelectTableRows.jsx";
import { EditModelSession } from "@/pages/models/details/EditModelSession.jsx";
import { useExportExcel } from "@/ui/hooks/useExportExcel.jsx";
import ExportToWord from "../ExportToWord/ExportToWord.jsx";
import { calcModelSessionDetails } from "./utils.jsx";
import { AGENCYS_NAMES } from "@/ui/components/ModelForm/constants.jsx";
import { COLLECTIONS } from "../../../../constants/collections.jsx";

import "./ModelSessions.scss";

const ModelSessions = ({ session, modelSessions, getModelSessions }) => {
  const [loading, setLoading] = useState(false);
  const [toggleModelId, setToggleModelId] = useState(false);
  const [toggleModelCity, setToggleModelCity] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [detailsCounter, setDetailsCounter] = useState(
    calcModelSessionDetails(
      modelSessions.filter((modelSession) => !modelSession.hasFine),
    ),
  );
  const [requestedModelSession, setRequestedModelSession] = useState(null);

  const { selectedRows, handleSelectRow, selectAllCheckboxProps } =
    useSelectTableRows({ rows: modelSessions });

  const onlyActiveModelSessions = modelSessions.filter(
    (modelSession) => !modelSession.hasFine,
  );

  const filteredModelSessions = modelSessions.filter(
    (modelSession) =>
      modelSession.model.name.toLowerCase().includes(searchValue.toLowerCase()), // Filtering logic
  );

  const { exportToExcel, isExporting } = useExportExcel({
    session: session,
    showModelId: toggleModelId,
    showModelCity: toggleModelCity,
    data: onlyActiveModelSessions,
  });

  const sessionTitle = `${session.production} ${dayjs(session.date).format("DD/MM/YYYY")}`;
  const handleSetRequestedModelSession = (modelSession) => {
    setRequestedModelSession(modelSession);
    setShowModalForm(true);
  };

  useEffect(() => {
    // Be Aware of that modelSessions with fine are not calculated!
    setDetailsCounter(
      calcModelSessionDetails(
        modelSessions.filter((modelSession) => !modelSession.hasFine),
      ),
    );
  }, [modelSessions]);

  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const handleUpdateMultipleModelSessions = async (modelSessionTemplate) => {
    await mapAsync(
      selectedRows,
      async (modelSessionId) =>
        await updateModelSession(modelSessionTemplate, modelSessionId),
    );
    await getModelSessions();
  };

  const handleUpdateModelSession = async (modelSession) => {
    await updateModelSession(modelSession, requestedModelSession.id);
    await getModelSessions();
  };

  const handleDeleteMultipleModelSessions = async () => {
    if (window.confirm("למחוק את המיוצגים מיום הצילום?")) {
      try {
        setLoading(true);
        await mapAsync(selectedRows, async (modelSessionId) =>
          deleteDoc(COLLECTIONS.modelSessions, modelSessionId),
        );
        await getModelSessions();
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onCloseModelEditForm = () => {
    setShowModalForm(false);
    setRequestedModelSession("");
  };

  const deleteModelSession = async (modelSessionId) => {
    if (window.confirm("למחוק את המיוצג מיום הצילום?")) {
      try {
        setLoading(true);
        await deleteDoc(COLLECTIONS.modelSessions, modelSessionId);
        await getModelSessions();
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadImages = async () => {
    const jszip = new JSZip();
    setLoading(true);
    try {
      const downloadedFiles = await Promise.all(
        modelSessions.map(({ model }) =>
          fetch(model.image).then((res) => res.blob()),
        ),
      );
      downloadedFiles.forEach((file, i) =>
        jszip.file(`${modelSessions[i]?.model?.name || i}.jpg`, file),
      );
      const content = await jszip.generateAsync({ type: "blob" });
      saveAs(content, sessionTitle);
      setLoading(false);
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };

  return (
    <>
      <Segment
        className="ModelSessions"
        style={{ overflowY: "scroll" }}
        loading={loading}
      >
        <Header className="noprint">
          <Message
            positive={!!onlyActiveModelSessions.length}
            negative={!!onlyActiveModelSessions.length === 0}
          >
            {`${onlyActiveModelSessions.length} משתתפים ביום צילום זה:`}
          </Message>
        </Header>
        <h1 className="only_print">{sessionTitle}</h1>

        <Menu attached="top">
          <Dropdown
            pointing="right"
            disabled={loading}
            loading={loading}
            text="תפריט"
            labeled
            button
            className="icon noprint"
          >
            <Dropdown.Menu>
              <Dropdown.Item
                text="Pdf"
                icon="file pdf"
                onClick={() => window.print()}
              />
              <ExportToWord
                data={onlyActiveModelSessions}
                sessionTitle={sessionTitle}
                detailsCounter={Object.fromEntries(
                  Object.entries(detailsCounter),
                )}
                showModelId={toggleModelId}
                showModelCity={toggleModelCity}
              />
              <Dropdown.Item
                text="Excel"
                icon="file excel"
                disabled={isExporting}
                onClick={exportToExcel}
              />
              <Dropdown.Item
                text="ייצא תמונות"
                icon="images"
                onClick={downloadImages}
              />
            </Dropdown.Menu>
          </Dropdown>

          {modelSessions && (
            <div className="labels-wrapper">
              {Object.entries(detailsCounter).map(([key, value]) => {
                const NO_PRINT_LABELS = [AGENCYS_NAMES.Matan];
                return (
                  <SessionLabel
                    key={key}
                    count={value}
                    icon={key}
                    text={key}
                    print={!NO_PRINT_LABELS.includes(key)}
                  />
                );
              })}
            </div>
          )}

          <MenuMenu position="left">
            <Input
              placeholder="חפש..."
              icon={{ name: "search", link: true }}
              value={searchValue}
              onChange={handleSearchChange}
            />
          </MenuMenu>
        </Menu>

        <Table definition selectable textAlign="center">
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell className="noprint">
                <Checkbox {...selectAllCheckboxProps()} />
              </Table.HeaderCell>
              <Table.HeaderCell>מס״ד</Table.HeaderCell>
              <Table.HeaderCell>
                שם
                <Icon
                  onClick={() => {
                    setToggleModelId((prevState) => !prevState);
                  }}
                  name="user"
                />
              </Table.HeaderCell>
              <Table.HeaderCell>תמונה</Table.HeaderCell>
              <Table.HeaderCell>מידות</Table.HeaderCell>
              <Table.HeaderCell>
                טלפון
                <Icon
                  onClick={() => {
                    setToggleModelCity((prevState) => !prevState);
                  }}
                  name="building"
                />
              </Table.HeaderCell>
              <Table.HeaderCell>דרך הגעה</Table.HeaderCell>
              <Table.HeaderCell>הערה</Table.HeaderCell>
              <Table.HeaderCell className="noprint">פעולות</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredModelSessions.map((modelSession, index) => {
              return (
                <ModelSession
                  key={index}
                  setRequestedModelSession={handleSetRequestedModelSession}
                  deleteModelSession={deleteModelSession}
                  modelSession={{ ...modelSession, index }}
                  isShowingIdNumber={toggleModelId}
                  isShowingModelCity={toggleModelCity}
                  selectedRows={selectedRows}
                  handleSelectRow={handleSelectRow}
                />
              );
            })}
          </Table.Body>
          <Table.Footer fullWidth className="noprint">
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="8">
                <Button
                  disabled={!selectedRows.length}
                  className="icon-button"
                  floated="right"
                  icon
                  labelPosition="right"
                  size="small"
                  onClick={() => setShowModalForm(true)}
                >
                  <Icon name="tasks" />
                  עריכה מרובה
                </Button>
                <Button
                  disabled={!selectedRows.length}
                  className="icon-button"
                  floated="right"
                  icon
                  negative
                  labelPosition="right"
                  size="small"
                  onClick={handleDeleteMultipleModelSessions}
                >
                  <Icon name="remove" />
                  מחיקה מרובה
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <EditModelSession
          showModalForm={showModalForm}
          onClose={onCloseModelEditForm}
          onSubmit={
            requestedModelSession
              ? handleUpdateModelSession
              : handleUpdateMultipleModelSessions
          }
          doc={requestedModelSession}
        />
      </Segment>
    </>
  );
};

export default ModelSessions;
