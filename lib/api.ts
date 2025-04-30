import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API response type
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

// Error response from API
interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
  data?: any;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string = process.env.EXPO_PUBLIC_API_URL || 'http://18.196.144.23:8080';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      withCredentials: false,
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CORS headers to every request
        config.headers = {
          ...config.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        console.log('🚀 Request:', {
          method: config.method?.toUpperCase(),
          url: this.baseURL + config.url,
          data: config.data,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }

  // Set auth token for all requests
  public setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Auth Token Set:', token.substring(0, 10) + '...');
  }

  // Clear auth token
  public clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
    console.log('🔒 Auth Token Cleared');
  }

  // Handle successful responses
  private handleSuccess(response: AxiosResponse): ApiResponse {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response.data;
  }

  // Handle errors
  private handleError(error: any): Promise<ApiError> {
    let errorResponse: ApiError = {
      success: false,
      message: 'An unexpected error occurred',
    };

    console.error('❌ Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorResponse = error.response.data as ApiError || {
        success: false,
        message: `Request failed with status code ${error.response.status}`,
        errorCode: `HTTP_${error.response.status}`,
      };
    } else if (error.code === 'ECONNABORTED') {
      // Request timed out
      errorResponse = {
        success: false,
        message: 'Request timed out. Please try again.',
        errorCode: 'TIMEOUT_ERROR',
      };
    } else if (error.message?.includes('Network Error')) {
      // Specific network error handling
      errorResponse = {
        success: false,
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        errorCode: 'NETWORK_ERROR',
      };
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse = {
        success: false,
        message: 'Unable to reach the server. Please try again later.',
        errorCode: 'NETWORK_ERROR',
      };
    }

    return Promise.reject(errorResponse);
  }

  // GET request
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.get(url, config);
    } catch (error) {
      throw error;
    }
  }

  // POST request
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.post(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // PUT request
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.put(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // DELETE request
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      return await this.client.delete(url, config);
    } catch (error) {
      throw error;
    }
  }

  // Upload file with multipart/form-data
  public async upload<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const uploadConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      };
      return await this.client.post(url, formData, uploadConfig);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a singleton instance
export const api = new ApiClient();