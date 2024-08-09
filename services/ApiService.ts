import { sleep } from "../utils/sleep";

import { AuthenticationInput, AuthenticationResponse, RecoverUserInput, RecoverUserResponse, RefreshTokenInput, RefreshTokenResponse, SignInInput, SignInResponse } from '../types/ApiService';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import HttpException from "./HttpException";

export default class ApiService {
    api: AxiosInstance;

    constructor(api: AxiosInstance) {
        this.api = api;
    }

    async authenticate(input?: AuthenticationInput, options?: AxiosRequestConfig<AuthenticationInput>): Promise<AuthenticationResponse> {
        try {
            const response = await this.api.post("/authentication", input, options);
            return response.data;
        } catch (error) {
            this.handleError(error, "Não foi possível autenticar o usuário.");
            throw error;
        }
    }

    async recoverUser(input?: RecoverUserInput, options?: AxiosRequestConfig<RecoverUserInput>): Promise<RecoverUserResponse> {
        try {
            const response = await this.api.post("/recover-user", input, options);
            return response.data;
        } catch (error) {
            this.handleError(error, "Não foi possível recuperar o usuário.");
            throw error;
        }
    }

    async refreshToken(input: RefreshTokenInput, options?: AxiosRequestConfig<RefreshTokenInput>): Promise<RefreshTokenResponse> {
      try {
          const response = await this.api.post("/refresh-token", input, options);
          return response.data;
      } catch (error) {
          this.handleError(error, "Não foi possível fazer a troca de token do usuário.");
          throw error;
      }
  }

    async signIn(input: SignInInput, options?: AxiosRequestConfig<SignInInput>): Promise<SignInResponse> {
        try {
            const response = await this.api.post("/signin", input, options);
            return response.data;
        } catch (error) {
            this.handleError(error, "Não foi possível realizar login.");
            throw error;
        }
    }

    private getErrorMessage (error: AxiosError<{ warning?: string, error?: string }>) {
      let message = "Verifique sua conexão com a internet";
      if (error.response) {
        message = error.response.data?.warning ?? error.response.data.error ?? message;
      }
      return message;
    }

    private handleError(error: unknown, genericMessage: string) {
      console.error("API Error:", genericMessage, error);
      if (axios.isAxiosError(error)) {
        const message = this.getErrorMessage(error);
        throw new HttpException(message, error.response?.status ?? 500);
      } 
      throw new Error(genericMessage);
    }
}
