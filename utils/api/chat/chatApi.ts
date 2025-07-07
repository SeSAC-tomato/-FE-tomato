import api from '../axios';

export const axiosGet = async <T, U extends object>(url: string, param?: U) => {
  try {
    const response = await api.get<T>(url, {
      params: param,
    });
    return response.data;
  } catch (error) {
    console.error('api 요청 실패', error);
    throw error;
  }
};
