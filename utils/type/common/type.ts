interface CommonResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        status: number;
        message: string;
        code: string;
        errors?: {}
    } 
}