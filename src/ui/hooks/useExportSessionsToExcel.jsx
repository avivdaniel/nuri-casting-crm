import { useState } from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { getModelSessionsForSession } from "../../services";

export const useExportSessionsToExcel = (sessions = []) => {
  const [loading, setLoading] = useState(false);

  const onExport = async ({
    includeAgencies = [],
    excludeAgencies = [],
  } = {}) => {
    setLoading(true);
    let workbook;
    try {
      // Create a new Excel workbook and worksheet
      workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sessions Report", {
        views: [{ rightToLeft: true }],
      });

      // Add headers to the worksheet with styling
      const headerRow = worksheet.addRow([
        "שם ההפקה",
        "תאריך צילומים",
        "שם המיוצג",
        "תעודת זהות",
        "טלפון",
        "סוכנות",
        "מספר ווצאפ",
      ]);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC0C0C0" },
        };
        cell.alignment = { horizontal: "right" };
        cell.font = { size: 16 };
      });

      // Process sessions
      for (const session of sessions) {
        const modelSessions = await getModelSessionsForSession(session.id);

        if (session.isPostponement) {
          continue; // Skip postponed sessions
        }

        for (const modelSession of modelSessions) {
          const agency = modelSession.model.agency;

          // Apply dynamic filtering
          if (
            modelSession.hasFine || // Skip if the session has a fine
            (includeAgencies.length && !includeAgencies.includes(agency)) || // Skip if agency is not in include list
            (excludeAgencies.length && excludeAgencies.includes(agency)) // Skip if agency is in exclude list
          ) {
            continue;
          }

          const { production, date } = session;
          const { name, whatsapp, idNumber, phone } = modelSession.model;

          // Add row for the session
          const row = worksheet.addRow([
            production,
            dayjs(date).format("DD/MM/YYYY"),
            name,
            idNumber,
            phone,
            agency,
            whatsapp,
          ]);

          row.eachCell((cell) => {
            cell.font = { size: 16 };
            cell.alignment = { horizontal: "right" };
          });
        }
      }

      // Set column widths
      worksheet.columns.forEach((column) => {
        column.width = 26;
      });

      // Export the workbook as an Excel file
      const blob = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([blob]), "report.xlsx");
    } catch (error) {
      console.error("Error exporting sessions to Excel:", error);
    } finally {
      // Ensure loading state is reset in both success and error cases
      setLoading(false);
    }
  };

  const exportForAgencies = async ({
    includeAgencies = [],
    excludeAgencies = [],
  } = {}) => {
    await onExport({ includeAgencies, excludeAgencies });
  };

  return { loading, exportForAgencies };
};
