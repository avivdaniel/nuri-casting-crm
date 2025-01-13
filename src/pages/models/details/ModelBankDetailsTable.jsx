import React, { useMemo } from "react";
import { useModelDetailsContext } from "../../../context/ModelDetailsContext.jsx";
import { Message, Segment, Table, TableRow } from "semantic-ui-react";
import { BANKS_OPTIONS } from "@/ui/components/ModelForm/constants.jsx";

export const ModelBankDetailsTable = () => {
  const { model } = useModelDetailsContext();

  const bankDetails = useMemo(() => {
    if (!model || !model?.bank) return [];
    const { account_number, bank_number, branch_number, account_owner } =
      model.bank;
    return [
      {
        label: "שם הבנק",
        value:
          BANKS_OPTIONS.find(({ value }) => value === bank_number)?.label ??
          bank_number,
      },
      { label: "מספר הסניף", value: branch_number },
      { label: "מספר חשבון", value: account_number },
      { label: "שם המוטב", value: account_owner },
    ];
  }, [model]);
  return (
    <Segment>
      {!!bankDetails.length ? (
        <Table definition textAlign="right">
          <Table.Body>
            {bankDetails?.map((detail) => (
              <TableRow key={detail.label}>
                <Table.Cell style={{ width: "15%" }}>{detail.label}</Table.Cell>
                <Table.Cell>{detail.value}</Table.Cell>
              </TableRow>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Message negative>
          <Message.Header>לא קיימים פרטי חשבון בנק</Message.Header>
        </Message>
      )}
    </Segment>
  );
};
