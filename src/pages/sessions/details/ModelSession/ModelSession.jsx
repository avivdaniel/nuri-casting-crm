import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Icon, Image, Label, Table } from "semantic-ui-react";
import { formatTransportation } from "../../../../utils/index.jsx";
import { AGENCYS_NAMES } from "@/ui/components/ModelForm/constants.jsx";
import "./ModelSession.scss";

const ModelSession = ({
  modelSession,
  deleteModelSession,
  setRequestedModelSession,
  isShowingIdNumber,
  selectedRows,
  handleSelectRow,
  isShowingModelCity,
}) => {
  const {
    id,
    index,
    hasTransportation,
    note,
    model,
    model: {
      id: modelId,
      name,
      city,
      agency,
      idNumber = "",
      shirtSize,
      pantsSize,
      shoeSize,
      height,
      phone,
      image,
    },
  } = modelSession;
  useEffect(() => {}, [isShowingIdNumber]);

  const tags = [
    { color: "blue", content: "מתן", isShow: agency === AGENCYS_NAMES.Matan },
    { color: "purple", content: "עטר", isShow: agency === AGENCYS_NAMES.Atar },
    { color: "orange", content: "קנס", isShow: modelSession?.hasFine || false },
  ];

  const renderTags = () => {
    return tags
      .filter((tag) => tag.isShow)
      .map((activeTag, i) => (
        <div key={i} className="model-session-tag noprint">
          <Label color={activeTag.color} tag>
            {activeTag.content}
          </Label>
        </div>
      ));
  };

  return (
    <>
      {model && (
        <Table.Row
          className={["ModelSession", modelSession?.hasFine && "noprint"]
            .filter(Boolean)
            .join(" ")}
        >
          <Table.Cell className="noprint">
            <Checkbox
              checked={selectedRows.includes(id)}
              onChange={() => handleSelectRow(id)}
            />
          </Table.Cell>
          <Table.Cell>
            {index + 1}
            {renderTags()}
          </Table.Cell>
          <Table.Cell>
            <Link
              key={modelId}
              to={`/admin/models/${modelId}`}
              style={{ textDecoraction: "none", color: "black" }}
            >
              {name}
              {isShowingIdNumber && model.hasOwnProperty("idNumber") && (
                <p>{`ת"ז: ${idNumber || ""}`}</p>
              )}
            </Link>
          </Table.Cell>
          <Table.Cell>
            <Link
              key={modelId}
              to={`/admin/models/${modelId}`}
              style={{ textDecoraction: "none", color: "black" }}
            >
              <Image size="tiny" src={image} alt={image} />
            </Link>
          </Table.Cell>
          <Table.Cell>
            <p>חולצה: {shirtSize}</p>
            <p>מכנסיים: {pantsSize}</p>
            <p>נעליים: {shoeSize}</p>
            <p>גובה: {height} ס"מ</p>
          </Table.Cell>
          <Table.Cell>
            <p>{phone}</p>
            {isShowingModelCity && <p>{city}</p>}
          </Table.Cell>
          <Table.Cell>
            {formatTransportation(hasTransportation) === "ללא"
              ? "-"
              : formatTransportation(hasTransportation)}
          </Table.Cell>
          <Table.Cell>{note}</Table.Cell>
          <Table.Cell className="noprint">
            <Icon
              onClick={() => setRequestedModelSession(modelSession)}
              color="green"
              link
              disabled={!!selectedRows.length}
              name="edit"
              to="#"
            />
            <Icon
              color="red"
              link
              onClick={() => deleteModelSession(id)}
              name="delete"
              to="#"
            />
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
};

export default ModelSession;
