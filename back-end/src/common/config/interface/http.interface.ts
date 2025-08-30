/**
 * @description: HttpConfig interface for parsed configuration and get data
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */
export interface HttpConfig {
  /*
   * The port number on which the server will listen for incoming connections.
   * */
  port: number;

  /*
   * Environment of the application.
   * */
  environment: string;
}
