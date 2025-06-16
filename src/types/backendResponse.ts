export interface BackendResponse<T> {
    status: string
    statusCode: number
    message: string
    errors?: Array<Error>
    data?: Array<T>
}

export interface Error{
    message: string
    field: string
    details: string
}

export interface ErrorResponse{
    status: string
    statusCode: number
    message: string
    errors: Array<Error>
}