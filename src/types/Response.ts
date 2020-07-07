interface BaseResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
}

interface Response extends BaseResponse {
    [x: string]: any; 
}

class ApiResponse implements Response {
    public statusCode: number;
    public statusMessage: string;
    public message: string;

    public constructor(response: Response) {
        this.statusCode = response.statusCode;
        this.statusMessage = response.statusMessage;
        this.message = response.message;

        // Assign all non-explicitly defined properties
        Object.assign(this, response);
    }
}

export function Response(response: Response): ApiResponse {
    return new ApiResponse(response);
}

type ErrorResponse = BaseResponse;

export class ApiError implements ErrorResponse {
    public statusCode: number;
    public statusMessage: string;
    public message: string;

    public constructor(response: ErrorResponse) {
        this.statusCode = response.statusCode;
        this.statusMessage = response.statusMessage;
        this.message = response.message;
    }
}

export function ErrorResponse(response: ErrorResponse): ApiError {
    return new ApiError(response);
}
