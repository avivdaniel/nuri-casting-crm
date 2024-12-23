import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  Header,
  Input,
  Menu,
  Message,
  Radio,
  Segment,
  Table,
} from "semantic-ui-react";
import Session from "./Session.jsx";
import { deleteDoc, fetchSessions, getDocsWhereMultiple } from "../../../services/index.jsx";
import { PageHero } from "../../../components/Ui/index.jsx";
import { useExportSessionsToExcel } from "../../../components/hooks/useExportSessionsToExcel.jsx";
import useStickyState from "../../../components/hooks/useStickyState.jsx";
import { COLLECTIONS } from "../../../constants/collections.jsx";
import { iconsNames } from "../../../components/Ui/CardGroups/consts.jsx";
import { AGENCYS_NAMES } from "../../../components/Ui/ModelForm/constants.jsx";

const SESSIONS_PER_PAGE = 10;

const SEARCH_KIND = {
  dateRange: "dateRange",
  text: "text",
};

const Sessions = () => {
  const [submitCount, setSubmitCount] = useState(0);
  const [sessions, setSessions] = useStickyState([], "sessions-search");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showMore, setShowMore] = useState(SESSIONS_PER_PAGE);
  const [searchKind, setSearchKind] = useState(SEARCH_KIND.text);

  const { exportForAgencies, loading: isLoadingExcel } =
    useExportSessionsToExcel(sessions);

  const deleteSession = async (sessionId) => {
    if (window.confirm("למחוק את יום הצילום?")) {
      try {
        await deleteDoc("sessions", sessionId);
        setSessions(sessions.filter((session) => session.id !== sessionId));
      } catch (err) {
        setError(err);
      }
    }
  };

  useEffect(() => {
    const getSessions = async () => {
      setError("");
      setLoading(true);
      let result = [];
      try {
        if (searchKind === SEARCH_KIND.text) {
          result = await fetchSessions(query, showMore);
        } else {
          const docs = await getDocsWhereMultiple(
            COLLECTIONS.sessions,
            [
              {
                field: "date",
                operator: ">=",
                value: startDate.toDate(),
              },
              {
                field: "date",
                operator: "<=",
                value: endDate.toDate(),
              },
            ],
            [{ field: "date", direction: "desc" }, { field: "production" }],
          );
          result = docs.map((session) => ({
            ...session,
            date: session.date.toDate(),
          }));
        }
        setLoading(false);
        setSessions(result);
        if (result.length === 0) {
          setError("לא נמצאו תוצאות");
        }
      } catch (err) {
        alert(err);
        setError("בעיה בחיבור אנא נסה שנית");
        setLoading(false);
      }
      setSubmitCount(0);
    };

    submitCount && getSessions();
  }, [
    submitCount,
    showMore,
    query,
    searchKind,
    setSessions,
    startDate,
    endDate,
    error,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitCount(1);
  };

  const handleSetSearchKind = (searchKind) => {
    setSessions([]);
    setQuery("");
    setError("");
    setSearchKind(searchKind);
  };

  return (
    <>
      <PageHero icon={iconsNames.search_session} header="חיפוש ימי צילום" />
      <Segment>
        <Header>חפש יום צילום:</Header>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group>
            {searchKind === SEARCH_KIND.dateRange && (
              <Form.Field>
                <Menu>
                  <Dropdown item icon="wrench" simple>
                    <DropdownMenu>
                      {[
                        {
                          title: `ייצוא ל-Excel`,
                          onClick: () =>
                            exportForAgencies({
                              excludeAgencies: [AGENCYS_NAMES.Matan],
                            }),
                        },
                        {
                          title: `ייצוא ${AGENCYS_NAMES.Take2} ל-Excel`,
                          onClick: () =>
                            exportForAgencies({
                              includeAgencies: [AGENCYS_NAMES.Take2],
                            }),
                        },
                        {
                          title: `ייצוא ${AGENCYS_NAMES.Matan} ל-Excel`,
                          onClick: () =>
                            exportForAgencies({
                              includeAgencies: [AGENCYS_NAMES.Matan],
                            }),
                        },
                      ].map(({ title, ...rest }) => (
                        <DropdownItem
                          key={title}
                          disabled={!sessions?.length || isLoadingExcel}
                          {...rest}
                        >
                          {title}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Menu>
              </Form.Field>
            )}
            <Form.Field width={10}>
              {searchKind === SEARCH_KIND.text ? (
                <Input
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="הכנס שם הפקה"
                  fluid
                />
              ) : (
                <Form.Group widths="equal">
                  <input
                    required
                    type="date"
                    onChange={(e) => setStartDate(dayjs(e.target.value))}
                  />

                  <input
                    required
                    type="date"
                    onChange={(e) => setEndDate(dayjs(e.target.value))}
                  />
                </Form.Group>
              )}
            </Form.Field>
            <Form.Field width={2}>
              <Radio
                checked={searchKind === SEARCH_KIND.text}
                onClick={() => handleSetSearchKind(SEARCH_KIND.text)}
                value={SEARCH_KIND.text}
                toggle
                disabled={isLoading}
                label="שם"
              />
              <Radio
                checked={searchKind === SEARCH_KIND.dateRange}
                onClick={() => handleSetSearchKind(SEARCH_KIND.dateRange)}
                value={SEARCH_KIND.dateRange}
                toggle
                disabled={isLoading}
                label="תאריך"
              />
            </Form.Field>
            <Form.Field width={4}>
              <Button
                color="blue"
                fluid
                disabled={
                  isLoading ||
                  (searchKind === SEARCH_KIND.text && !query) ||
                  (searchKind === SEARCH_KIND.dateRange &&
                    !endDate &&
                    !startDate)
                }
                loading={isLoading}
                type="submit"
              >
                חפש
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
      {error ? (
        <Message error content={error} />
      ) : (
        <>
          {sessions.length > 0 && (
            <Segment loading={isLoading || isLoadingExcel}>
              <Header>
                <Message
                  success
                  content={`נמצאו ${
                    sessions.length >= showMore * 1 ? "מעל" : ""
                  } ${sessions.length} תוצאות:`}
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
                    <Table.HeaderCell>הפקה</Table.HeaderCell>
                    <Table.HeaderCell>תאריך</Table.HeaderCell>
                    <Table.HeaderCell>פעולות</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sessions.map((session) => (
                    <Session
                      key={session.id}
                      deleteSession={deleteSession}
                      session={session}
                    />
                  ))}
                </Table.Body>
              </Table>
              <Button
                color="green"
                disabled={sessions.length < showMore * 1}
                onClick={() => {
                  setSubmitCount(1);
                  setShowMore(showMore + SESSIONS_PER_PAGE);
                }}
              >
                הצג עוד ימי צילום
              </Button>
            </Segment>
          )}
        </>
      )}
    </>
  );
};

export default Sessions;
