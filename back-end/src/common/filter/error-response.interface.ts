export interface ErrorResponse {
	statusCode: number
	message: string | string[]
	error?: string
	[key: string]: any
}
