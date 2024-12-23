import {useState} from "react";

export const useSelectTableRows = ({rows}) => {
    const [selectedRows, setSelectedRows] = useState([]); //Id string arr

    const handleSelectRow = (rowId) => {
        selectedRows.includes(rowId)
            ? setSelectedRows(selectedRows.filter(id => id !== rowId))
            : setSelectedRows(prevState => [...prevState, rowId])
    }

    const handleSelectAll = (condition = () => true) => {
        const filteredRows = rows.filter(row => condition(row));
        const selectedRowsIds = filteredRows.map(row => row.id);
        setSelectedRows(selectedRowsIds.length === selectedRows.length ? [] : selectedRowsIds);
    };

    const selectAllCheckboxProps = (condition = () => true) => {
        return {
            onChange: () => handleSelectAll(condition),
            checked: selectedRows.length === rows.length
        }
    };

    const clearAllSelectedRows = () => setSelectedRows([])

    return {selectedRows, handleSelectRow, selectAllCheckboxProps, clearAllSelectedRows}
}