import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatTransportation } from "../../utils/index.jsx";

export const useExportExcel = ({
  data = [],
  session,
  showModelId,
  showModelCity,
}) => {
  const [isExporting, setIsExporting] = useState(false); // Loading for exporting

  const getBase64Image = useCallback((blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  const getBlob = useCallback(
    async (image) => {
      const response = await fetch(image);
      const imageBlob = await response.blob();
      return await getBase64Image(imageBlob);
    },
    [getBase64Image],
  );

  const fileName = useMemo(() => {
    return session
      ? `${session.production}${dayjs(session.date).format("MM/DD/YYYY")}`
      : "טבלה";
  }, [session]);

  const exportToExcel = useCallback(async () => {
    setIsExporting(true);
    try {
      const modelSessions = await Promise.all(
        data.map(async ({ model, id, ...restSession }, index) => {
          const { image, ...restModel } = model;
          const imageBlob = await getBlob(image);
          return {
            image: imageBlob,
            modelSessionId: id,
            modelIndex: index + 1,
            ...restSession,
            ...restModel,
          };
        }),
      );

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define column structure
      worksheet.columns = [
        { header: "הערות", key: "note", width: 30 },
        { header: "הסעה", key: "transportation", width: 20 },
        { header: "טלפון", key: "phone", width: 20 },
        { header: "מידות", key: "sizes", width: 20 },
        { header: "שם", key: "name", width: 20 },
        { header: "תמונה", key: "image", width: 15 },
        { header: "מס״ד", key: "modelIndex", width: 10 },
      ];

      // Apply formatting to headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { name: "David", size: 16, bold: true };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 25;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFAFAD2" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Populate rows with processed data
      for (const session of modelSessions) {
        const {
          modelIndex,
          image,
          name,
          idNumber,
          shirtSize,
          pantsSize,
          shoeSize,
          height,
          phone,
          city,
          hasTransportation,
          note,
        } = session;

        const rowData = {
          note,
          transportation:
            formatTransportation(hasTransportation) === "ללא"
              ? "-"
              : formatTransportation(hasTransportation),
          phone: showModelCity ? `${city || ""} ${phone || ""}` : phone,
          sizes: `
          חולצה: ${shirtSize || ""}
          מכנסיים: ${pantsSize || ""}
          נעליים: ${shoeSize || ""}
          גובה: ${height || ""} ס"מ`,
          name: showModelId ? `${name} ${idNumber}` : name,
          modelIndex,
        };

        const row = worksheet.addRow(rowData);

        // Set row alignment and borders
        row.eachCell((cell) => {
          cell.alignment = {
            wrapText: true,
            horizontal: "center",
            vertical: "middle",
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Add image if exists
        if (image) {
          const imageId = workbook.addImage({
            base64: image,
            extension: "jpeg",
          });

          worksheet.getRow(row.number).height = 120;
          worksheet.addImage(imageId, {
            tl: { col: 5, row: row.number - 1 },
            br: { col: 6, row: row.number },
          });
        }
      }
      // Generate and save the file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  }, [data, data.length, showModelId, showModelCity, fileName]);

  return {
    exportToExcel,
    isExporting,
  };
};
