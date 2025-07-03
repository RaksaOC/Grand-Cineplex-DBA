export const getPrivDescription = (privilege: string) => {
  switch (privilege) {
    case "SELECT":
      return "Read data";
    case "INSERT":
      return "Add new records";
    case "UPDATE":
      return "Modify records";
    case "DELETE":
      return "Remove records";
    case "TRUNCATE":
      return "Delete all records";
    case "REFERENCES":
      return "Create foreign keys";
    case "TRIGGER":
      return "Create triggers";
    default:
      return "Unknown privilege";
  }
};

export const convertDataType = (dataType: string) => {
  switch (dataType) {
    case "character varying":
      return "VARCHAR";
    case "integer":
      return "INT";
    case "boolean":
      return "BOOLEAN";
    case "timestamp without time zone":
      return "TIMESTAMP";
    case "text":
      return "TEXT";
    case "date":
      return "DATE";
    case "time without time zone":
      return "TIME";
    case "timestamp with time zone":
      return "TIMESTAMP WITH TIME ZONE";
    case "uuid":
      return "UUID";
    case "jsonb":
      return "JSONB";
    case "json":
      return "JSON";
    case "double precision":
      return "DOUBLE PRECISION";
    case "numeric":
      return "NUMERIC";
    case "real":
      return "REAL";
    case "smallint":
      return "SMALLINT";
    case "bigint":
      return "BIGINT";
    case "smallserial":
      return "SMALLSERIAL";
    case "serial":
      return "SERIAL";
    case "bigserial":
      return "BIGSERIAL";
    case "money":
      return "MONEY";
    case "bytea":
      return "BYTEA";
    case "inet":
      return "INET";
    case "cidr":
      return "CIDR";
    case "macaddr":
      return "MACADDR";
    case "interval":
      return "INTERVAL";
    case "time with time zone":
      return "TIME WITH TIME ZONE";
    case "time without time zone":
      return "TIME WITHOUT TIME ZONE";
    case "timestamp with time zone":
      return "TIMESTAMP WITH TIME ZONE";
    case "timestamp without time zone":
      return "TIMESTAMP WITHOUT TIME ZONE";
    default:
      return dataType;
  }
};
