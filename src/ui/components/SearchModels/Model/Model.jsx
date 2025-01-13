import React from "react";
import { Link } from "react-router-dom";
import { Table, Icon } from "semantic-ui-react";

const Model = ({
  model,
  deleteModel = () => {},
  showActions = true,
  toggleArchiveModel = () => {},
}) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link
          key={model.id}
          to={`/admin/models/${model.id}`}
          style={{ textDecoraction: "none", color: "black" }}
        >
          {model?.name}
        </Link>
      </Table.Cell>
      <Table.Cell>
        {model?.gender?.toLowerCase() === "male" ? "ז" : "נ"}
      </Table.Cell>
      <Table.Cell>{model?.phone}</Table.Cell>
      {showActions && (
        <Table.Cell>
          <Link
            style={{ color: "green" }}
            to={`/admin/models/${model?.id}/edit`}
          >
            <Icon name="edit" />
          </Link>
          <Icon
            name="delete"
            link
            style={{ color: "red" }}
            onClick={() => deleteModel(model?.id)}
          />
          <Icon
            name={model?.isActive ? "archive" : "folder open"}
            link
            style={{ color: "blue" }}
            onClick={async () => await toggleArchiveModel(model)}
          />
        </Table.Cell>
      )}
    </Table.Row>
  );
};

export default Model;
