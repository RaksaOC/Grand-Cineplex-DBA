export interface TableColumn {
  column_name: string;
  data_type: string;
}

export interface Table {
  name: string;
  rowCount: number;
  columns: TableColumn[];
}
