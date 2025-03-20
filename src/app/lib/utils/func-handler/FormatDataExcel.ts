export const formatDataExcel = (mapFields: Record<string, string>, rows: any[]) => {
  return rows.map(row => {
    const formattedRow: Record<string, any> = {};
    for (const key in row) {
      const mappedKey = mapFields[key] || mapFields.key || key;
      formattedRow[mappedKey] = row[key];
    }
    return formattedRow;
  });
};
