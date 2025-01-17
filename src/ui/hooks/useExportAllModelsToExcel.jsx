import { useState } from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import {COLLECTIONS} from "@/constants/collections.jsx";
import {getEntireCollection} from "@/services/index.jsx";
import {EMPLOYMENT_STATUS} from "@/pages/models/details/EmploymentStatus/consts.jsx";

export const useExportAllModelsToExcel = () => {
    const [loading, setLoading] = useState(false);

    const exportModels = async () => {
        const userConfirmed = window.confirm("האם אתה בטוח שברצונך לייצא את כל המיוצגים?");
        if (!userConfirmed) return;
        setLoading(true);

        try {
            // Fetch all models from Firestore
            const models = await getEntireCollection(COLLECTIONS.models)

            if (models.length === 0) {
                alert("No models found to export.");
                setLoading(false);
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("מיוצגים קיימים במערכת", {
                views: [{ rightToLeft: true }],
            });
            //
            // // Add headers to the worksheet
            const headerRow = worksheet.addRow([
                "תעודת זהות",
                "מגדר",
                "שם המיוצג",
                "טלפון",
                "שם הבנק",
                "מספר הסניף",
                "מספר חשבון",
                "שם המוטב",
                "מעמד תעסוקתי"
            ]);

            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFC0C0C0" },
                };
                cell.font = { bold: true, size: 14 };
                cell.alignment = { horizontal: "center" };
            });

            // Add rows for each model
            models.forEach((model) => {
                const {
                    idNumber = '',
                    name = '',
                    phone = '',
                    gender = '',
                    bank: {
                        account_number = '',
                        bank_number = '',
                        branch_number = '',
                        account_owner = ''
                    } = {},
                    employmentStatus = ''
                } = model ?? {};

                worksheet.addRow([
                    idNumber,
                    gender === 'female' ? 'נקבה' : 'זכר',
                    name,
                    phone,
                    bank_number,
                    branch_number,
                    account_number,
                    account_owner,
                    EMPLOYMENT_STATUS?.[employmentStatus]?.label || ''
                ]);
            });

            worksheet.columns.forEach((column) => {
                column.width = 15;
                column.alignment = { horizontal: "right" };
            });

            const blob = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([blob]), `כל_המיוצגים_${dayjs().format("DD-MM-YYYY")}.xlsx`);
        } catch (error) {
            console.error("Error exporting models to Excel:", error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, exportModels };
};
