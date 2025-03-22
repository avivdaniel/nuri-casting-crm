import React, { useEffect, useState, useMemo } from "react";
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
  const [sortType, setSortType] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedModelSessions, setSortedModelSessions] = useState([]);
  const [requestedModelSession, setRequestedModelSession] = useState(null);

  const { selectedRows, handleSelectRow, selectAllCheckboxProps } =
    useSelectTableRows({ rows: modelSessions });

  const modelSessionsWithoutFines = useMemo(() => 
    sortedModelSessions.filter(
      (modelSession) => !modelSession.hasFine,
    ),
    [sortedModelSessions]
  );

  const modelSessionsMatchingSearch = useMemo(() =>
    sortedModelSessions.filter(
      (modelSession) =>
        modelSession.model.name.toLowerCase().includes(searchValue.toLowerCase()),
    ),
    [sortedModelSessions, searchValue]
  );

  useEffect(() => {
    if (!modelSessions.length) {
      setSortedModelSessions([]);
      return;
    }

    const sortModelSessions = [...modelSessions];
    
    const sortFunction = (a, b) => {
      let comparison = 0;
      
      switch (sortType) {
        case "name":
          comparison = a.model.name.localeCompare(b.model.name);
          break;
        case "note":
          const noteA = a.note || "";
          const noteB = b.note || "";
          comparison = noteA.localeCompare(noteB);
          break;
        default:
          comparison = a.model.name.localeCompare(b.model.name);
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    };
    
    sortModelSessions.sort(sortFunction);
    setSortedModelSessions(sortModelSessions);
  }, [modelSessions, sortType, sortDirection]);

  useEffect(() => {
    setSortedModelSessions(modelSessions);
  }, [modelSessions]);

  const { exportToExcel, isExporting } = useExportExcel({
    session: session,
    showModelId: toggleModelId,
    showModelCity: toggleModelCity,
    data: modelSessionsWithoutFines,
  });

  const sessionTitle = `${session.production} ${dayjs(session.date).format("DD/MM/YYYY")}`;
  const handleSetRequestedModelSession = (modelSession) => {
    setRequestedModelSession(modelSession);
    setShowModalForm(true);
  };

  const detailsCounter = useMemo(() => 
    calcModelSessionDetails(modelSessionsWithoutFines),
    [modelSessionsWithoutFines]
  );

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

  const handleSortChange = (newSortType) => {
    if (newSortType === sortType) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortType(newSortType);
      setSortDirection("asc");
    }
  };
  
  const getSortDirectionIcon = (type) => {
    if (type !== sortType) return null;
    return sortDirection === "asc" ? "arrow alternate circle up outline" : "arrow alternate circle down outline";
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
            positive={!!modelSessionsWithoutFines.length}
            negative={!!modelSessionsWithoutFines.length === 0}
          >
            {`${modelSessionsWithoutFines.length} משתתפים ביום צילום זה:`}
          </Message>
        </Header>
        <h1 className="only_print">{sessionTitle}</h1>

        <Menu attached="top">
          <Dropdown
            pointing="down"
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
                data={modelSessionsWithoutFines}
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

          <Dropdown 
            text="מיון לפי"
            pointing="down"
            labeled
            button
            disabled={loading}
            loading={loading}
            className="icon noprint"
          >
            <Dropdown.Menu>
              <Dropdown.Item 
                text="שם" 
                active={sortType === "name"}
                onClick={() => handleSortChange("name")}
                icon={getSortDirectionIcon("name")}
                style={{ alignItems: 'center', justifyContent: 'center' }}
              />
              <Dropdown.Item 
                text="הערות" 
                active={sortType === "note"}
                onClick={() => handleSortChange("note")}
                icon={getSortDirectionIcon("note")}
                style={{ alignItems: 'center', justifyContent: 'center' }}
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
            {modelSessionsMatchingSearch.map((modelSession, index) => {
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
