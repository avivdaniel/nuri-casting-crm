import * as React from 'react';
import {Link} from "react-router-dom";
import {Icon, Table} from "semantic-ui-react";
import dayjs from "dayjs";

const Session = ({ session, deleteSession, actions = true }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link
          key={session.id}
          to={`/admin/sessions/${session.id}`}
          style={{ textDecoraction: "none", color: "black" }}
        >
          {session.production}
        </Link>
      </Table.Cell>
      <Table.Cell>
          {session?.date && (
              <span>{dayjs(session?.date instanceof Date ? session.date: new Date(session?.date)).format("DD/MM/YYYY")}</span>
          )}
      </Table.Cell>
        {actions && <Table.Cell>
        <Link style={{ color: "green" }} to={`/admin/sessions/${session.id}/edit`}>
          <Icon name="edit" />
        </Link>
        <Icon
          style={{ color: "red" }}
          link
          name="delete"
          onClick={() => deleteSession(session.id)}
        />
      </Table.Cell>}
    </Table.Row>
  );
};

export default Session;
