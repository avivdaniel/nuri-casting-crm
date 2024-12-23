import React, { useMemo } from "react";
import { Divider, Header, Segment, Table, TableRow } from "semantic-ui-react";
import { useModelDetailsContext } from "../../../context/ModelDetailsContext.jsx";
import { AGENCYS_TRANSLATIONS } from "../../../components/Ui/ModelForm/constants.jsx";
import { EMPLOYMENT_STATUS } from "./EmploymentStatus/consts.jsx";

const ModelSizesTable = () => {
  const { model } = useModelDetailsContext();

  const isSalariedEmployee =
    model?.employmentStatus === EMPLOYMENT_STATUS.salariedEmployee.value;

  const modelSizes = useMemo(() => {
    if (!model) return [];
    return [
      { label: "ת״ז", value: model?.idNumber },
      // {label: 'גיל', value: getAgeFromUnix(model?.birthday)},
      {
        label: "סוכנות",
        value: AGENCYS_TRANSLATIONS[model?.agency] || model?.agency,
      },
      {
        label: "מעמד תעסוקתי",
        value: EMPLOYMENT_STATUS?.[model?.employmentStatus]?.label || "-",
      },
      ...(isSalariedEmployee
        ? [
            {
              label: "אחוז שכר אומנים",
              value: model?.artistFeePercentage
                ? `${model?.artistFeePercentage}%`
                : "-",
            },
            {
              label: "עד לסכום שכר אומנים",
              value: model?.artistFeeCap ? `${model?.artistFeeCap} ש״ח` : "-",
            },
          ]
        : []),
      { label: "גובה", value: `${model?.height}ס״מ ` },
      { label: "מידת נעליים", value: model.shoeSize },
      { label: "מידת מכנסיים", value: model.pantsSize },
      { label: "מידת חולצה", value: model.shirtSize },
    ];
  }, [model]);

  return (
    <>
      <Divider horizontal>
        <Header as="h2">פרטים נוספים</Header>
      </Divider>
      <Segment>
        <Table definition textAlign="right">
          <Table.Body>
            {!!modelSizes.length &&
              modelSizes.map((detail) => (
                <TableRow key={detail.label}>
                  <Table.Cell>{detail.label}</Table.Cell>
                  <Table.Cell>{detail.value}</Table.Cell>
                </TableRow>
              ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  );
};

export default ModelSizesTable;
