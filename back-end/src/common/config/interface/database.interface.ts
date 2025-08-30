/**
 * @description: DatabaseConfig interface for parsed configuration and get data
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */
export interface DatabaseConfig {
  /*
   * The hostname or IP address of the database server.
   * */
  host: string;

  /*
   * The port number on which the database server is listening.
   * Default for PostgreSQL is 5432, for MySQL is 3306.
   * */
  port: number;

  /*
   * The username for authenticating with the database.
   * */
  username: string;

  /*
   * The password for authenticating with the database.
   * */
  password: string;

  /*
   * The name of the specific database to connect to.
   * */
  database: string;
}
