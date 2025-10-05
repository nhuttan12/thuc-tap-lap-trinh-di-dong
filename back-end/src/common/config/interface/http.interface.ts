/**
 * @description HttpConfig interface for parsed configuration and get data
 * @author Nhut Tan
 * @since 2025-08-30
 * @version 1.0.0
 */
export interface HttpConfig {
	/*
	 * The port number on which the server will listen for incoming connections.
	 */
	port: number;

	/*
	 * Environment of the application.
	 */
	environment: string;

	/*
	 * Secret key for JWT to decode.
	 */
	jwtSecret: string;

	/*
	 * Expiration time for JWT.
	 */
	expireTime: string;

	/**
	 * Number of salt rounds for bcrypt.
	 */
	saltRounds: number;
}
