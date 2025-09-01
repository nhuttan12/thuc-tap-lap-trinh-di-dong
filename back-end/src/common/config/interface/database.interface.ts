/**
 * @description: DatabaseConfig interface for parsed configuration and get data
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @modifies: 2025-09-01
 * @version: 1.0.1
 * */
export interface DatabaseConfig {
  /*
   * The type of database to connect to.
   * */
  type: string;

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
