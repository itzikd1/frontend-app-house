export interface ApiResponse<T> {
  data: {
    success: boolean;
    item: T;
  };
}

