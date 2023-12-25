import * as XLSX from "xlsx";

export function readXlsx(file, resovler, onFinish, onError) {
    var reader = new FileReader();
    reader.onerror = onError;
    reader.onloadend = onFinish;
    reader.onload = function (e) {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        resovler(data);
    };

    reader.readAsBinaryString(file);
}

export function createXlsx(data) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = { Sheets: { 'Sheet1': ws }, SheetNames: ['Sheet1'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType });
    return blob;
}