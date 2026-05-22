export class ApiResponse {
  static success(message: string, data: any = null) {
    return {
      success: true,
      message,
      data,
    };
  }
}