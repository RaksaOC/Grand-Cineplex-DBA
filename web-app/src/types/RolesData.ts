export interface TablePrivileges {
  name: string;
  privileges: string[];
}

export interface RolesData {
  role: string;
  tables: TablePrivileges[];
}
