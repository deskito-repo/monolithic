const {
  DB_CONNECTION_STRING: connectionString,
  DB_HOST: host = '',
  DB_NAME: database = '',
  DB_USER: user = '',
  DB_PASSWORD: password = '',
  DB_PORT: port = 5432,
} = process.env;
export default connectionString ? {
  connectionString,
} : {
  host,
  database,
  password,
  user,
  port: Number(port),
};
