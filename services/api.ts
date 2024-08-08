import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from 'axios';

import { AsyncStorage } from './AsyncStorage';
import * as Updates from 'expo-updates';
import ApiService from './ApiService';

const api = axios.create({
    baseURL: 'http://192.168.0.112/sampleapi',
    timeout: 60000,
    headers: { 
        // token: '26d7c43e-504f-4bab-8177-8392fd4839ee',
    },
});

export const apiHandler = new ApiService(api)

api.interceptors.request.use(
  async (req: InternalAxiosRequestConfig) => {
    
  // adiciona token caso não exista nos headers
  if (req.headers && !req.headers.token) { 
    const accessToken = await AsyncStorage.getItem('@access_token');

    req.headers.token = accessToken;

    api.defaults.headers.common.token = accessToken;
  }

  return req;
});

// Intercepta as solicitações e adiciona um token de acesso válido ao cabeçalho da solicitação
api.interceptors.response.use(async function (response) {
  return response;
}, async function (error: AxiosError<{ code: string }>) {
  const req = error.config as AxiosRequestConfig;
  
  const errToLargeRequest = new AxiosError("Request Entity Too Large");

  if (error.message === "Maximum response size reached") {
    return Promise.reject(errToLargeRequest);
  }
  
  if (error.response?.status == 401 && error.response?.data?.code === "ACCESS_TOKEN_INVALID") { 
      try {
        const refreshToken = await AsyncStorage.getItem("@refresh_token");

        const response = await apiHandler.refreshToken({ refreshToken });
        
        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;

        await AsyncStorage.setItem('@access_token', newAccessToken);
        await AsyncStorage.setItem('@refresh_token', newRefreshToken);
        
        req.headers = { ...req.headers, token: newAccessToken };

        api.defaults.headers.common.token = newAccessToken;

        return api(req);
      } catch (err) {

        if (isAxiosError(err)) {
          if (!err.response) return Promise.reject(err);
        }

        await AsyncStorage.clear();
        await Updates.reloadAsync();
        return Promise.reject(err);
      }
    } else if (error.response?.status === 413) {
      console.log("Maximum response size reached");
      return Promise.reject(error);
    }

    return Promise.reject(error);
});

export default api;