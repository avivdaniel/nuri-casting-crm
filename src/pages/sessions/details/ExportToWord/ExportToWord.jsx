import React, { useState } from "react";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  ImageRun,
  PageOrientation,
  AlignmentType,
  TextRun,
  WidthType,
} from "docx";
import { formatTransportation } from "../../../../utils.jsx";
import { Dropdown } from "semantic-ui-react";
import { AGENCYS_NAMES } from "../../../../components/Ui/ModelForm/constants.jsx";
import { sessionDetailsTranslations } from "../../../../constants/sessionDetailsTranslations.jsx";

const ExportToWord = ({
  data,
  sessionTitle,
  detailsCounter,
  showModelCity,
  showModelId,
}) => {
  const [loading, setLoading] = useState(false);
  const counterLabels = Object.fromEntries(
    Object.entries(detailsCounter).filter(
      ([key]) => key !== AGENCYS_NAMES.Matan,
    ),
  );

  const columnTitles = [
    "מסד",
    "שם",
    "תמונה",
    "מידות",
    "טלפון",
    "דרך הגעה",
    "הערה",
  ];

  const generate = async () => {
    setLoading(true);
    const items = await Promise.all(
      data.map(async ({ model, id, ...restSession }, index) => {
        const { image, ...restModel } = model;
        const blob = await fetch(image).then((r) => r.blob());
        return {
          image: blob,
          modelSessionId: id,
          modelIndex: index + 1,
          ...restSession,
          ...restModel,
        };
      }),
    );

    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "normalPara",
            name: "Normal Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 26,
              bold: true,
            },
          },
          {
            id: "normalPara2",
            name: "Normal Para2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 20,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              style: "normalPara",
              children: [
                new TextRun({
                  text: sessionTitle,
                  style: "normalPara",
                  break: 2,
                  bold: true,
                  size: 40,
                }),
              ],
            }),
            new Table({
              visuallyRightToLeft: true,
              columnWidths: Object.keys(counterLabels).map(() => 3000),
              rows: [
                //Labels header cells
                new TableRow({
                  children: [
                    ...Object.keys(counterLabels).map((key) => {
                      return new TableCell({
                        width: {
                          size: 100 / Object.keys(counterLabels).length,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            style: "normalPara",
                            text: sessionDetailsTranslations[key],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      });
                    }),
                  ],
                }),
                // Labels Body cells
                new TableRow({
                  children: [
                    ...Object.values(counterLabels).map((value) => {
                      return new TableCell({
                        children: [
                          new Paragraph({
                            text: value.toString(),
                            style: "normalPara2",
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      });
                    }),
                  ],
                }),
              ],
            }),
            //Line break
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "",
                  break: 1,
                  bold: true,
                  size: 40,
                }),
              ],
            }),
            new Table({
              columnWidths: [1000, 3000, 3000, 3000, 3000, 3000, 3000],
              visuallyRightToLeft: true,
              rows: [
                new TableRow({
                  children: [
                    ...columnTitles.map((col) => {
                      return new TableCell({
                        width: {
                          size: 100 / columnTitles.length,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            text: col,
                            style: "normalPara",
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                      });
                    }),
                  ],
                }),

                ...items.map(
                  (
                    {
                      name,
                      city,
                      idNumber,
                      modelIndex,
                      image,
                      shirtSize,
                      pantsSize,
                      shoeSize,
                      height,
                      phone,
                      hasTransportation,
                      note,
                    },
                    i,
                  ) => {
                    return new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: (i + 1).toString(),
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: !showModelId ? name : name + " " + idNumber,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new ImageRun({
                                  data: image,
                                  transformation: {
                                    width: 150,
                                    height: 170,
                                  },
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: `${shirtSize} :חולצה`,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                              text: `${pantsSize} :מכנסיים`,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                              text: `${shoeSize} :נעליים`,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                              text: `${height} :גובה`,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: !showModelCity ? phone : phone + " " + city,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text:
                                formatTransportation(hasTransportation) ===
                                "ללא"
                                  ? "-"
                                  : formatTransportation(hasTransportation),
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: note,
                              style: "normalPara2",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                      ],
                    });
                  },
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${sessionTitle}.docx`);
    setLoading(false);
  };

  return (
    <Dropdown.Item
      text="Docx"
      icon="file word"
      onClick={generate}
      disabled={loading}
    />
  );
};

export default ExportToWord;
