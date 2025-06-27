export const tables = {
    roles: {
      pg_roles: "pg_catalog.pg_roles",
      pg_user: "pg_catalog.pg_user",
      pg_authid: "pg_catalog.pg_authid", // (superuser only!)
    },
  
    privileges: {
      pg_class: "pg_catalog.pg_class", // includes ACLs (relacl)
      role_table_grants: "information_schema.role_table_grants",
    },
  
    schema: {
      tables: "information_schema.tables",
      columns: "information_schema.columns",
      pg_namespace: "pg_catalog.pg_namespace", // schema names
      pg_attribute: "pg_catalog.pg_attribute", // column-level info
      pg_type: "pg_catalog.pg_type", // data types
    },
  
    activity: {
      pg_stat_activity: "pg_catalog.pg_stat_activity", // live connections
      pg_stat_database: "pg_catalog.pg_stat_database", // db-level stats
      pg_stat_user_tables: "pg_catalog.pg_stat_user_tables", // user table stats
    },
  
    metadata: {
      pg_tables: "pg_catalog.pg_tables", // basic table info
      pg_indexes: "pg_catalog.pg_indexes",
      pg_views: "pg_catalog.pg_views",
    },
  
    optional: {
      pg_stat_statements: "pg_catalog.pg_stat_statements", // if extension is enabled
    },
  };
  