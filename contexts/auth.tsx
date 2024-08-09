import React from "react";
import { sleep } from "../utils/sleep";
import * as SecureStore from 'expo-secure-store';
import { apiHandler } from "../services/api";
import api from "../services/api";
import HttpException from "../services/HttpException";
import * as Updates from 'expo-updates';

export interface AuthContextData {
    token: string | null
    signed: boolean
    signIn(email: string, password: string): Promise<void>
    signOut(): Promise<void>
    initialLoading: boolean
}

const AuthContext = React.createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps { children: React.ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<any | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  const [initialLoading, setInitialLoading] = React.useState<boolean>(false);
  const [signed, setSigned] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      setInitialLoading(true);
      try {
        // em primeiro lugar tem que verificar se tem um update a fazer
        await fetchUpdateAsync();

        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (!accessToken) throw new Error("Access Token not provided in secure store");

        api.defaults.headers.common.Authorization = accessToken;

        const authenticateData = await apiHandler.authenticate();

        if (!authenticateData) throw new Error("Response is empty");

        if (!authenticateData.success) {
          // deu errado 
        }

        const recoverUserData = await apiHandler.recoverUser();

        if (!recoverUserData) throw new Error("Response is empty");

        if (!recoverUserData.user) {
          // deu errado 
        }

        setAccessToken(accessToken);

        await SecureStore.setItemAsync('user', JSON.stringify(recoverUserData.user));
        setUser(recoverUserData.user);

        setSigned(true);
      } catch (err) {
        // Restoring token failed
        console.log(err);
      } finally {
        setInitialLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  async function fetchUpdateAsync () {
    try {
      if (Updates.channel === "production" || Updates.channel === "preview") {
        const update = await Updates.checkForUpdateAsync();
        if (update?.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      
    }
  };

  async function authenticate() {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');

      if (!accessToken) throw new Error("Access Token not provided in secure store");

      api.defaults.headers.common.Authorization = accessToken;

      const authenticateData = await apiHandler.authenticate();

      if (!authenticateData) throw new Error("Response is empty");

      if (!authenticateData.success) {
        // deu errado 
      }

      const recoverUserData = await apiHandler.recoverUser();

      if (!recoverUserData) throw new Error("Response is empty");

      if (!recoverUserData.user) {
        // deu errado 
      }

      setAccessToken(accessToken);

      await SecureStore.setItemAsync('user', JSON.stringify(recoverUserData.user));
      setUser(recoverUserData.user);

      setSigned(true);
    } catch (error) {
      console.log(error);
      throw error;
    } finally { 

    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await apiHandler.signIn({ email, password });

      if (!response) throw new Error("Response is empty");

      api.defaults.headers.common.Authorization = response?.accessToken;

      await SecureStore.setItemAsync('accessToken', response?.accessToken);
      setAccessToken(accessToken);

      await SecureStore.setItemAsync('user', JSON.stringify(response.user));
      setUser(response.user);
      
      setSigned(true)
    } catch (error) {
      console.log(error);
      throw error;
    } finally { 

    }
  }

  async function signOut() {
    try {

      await SecureStore.deleteItemAsync('accessToken');
      setAccessToken(null);
      await SecureStore.deleteItemAsync('user');
      setUser(null);

      api.defaults.headers.common.Authorization = "";
      
      setSigned(false)
    } catch (error) {
      console.log(error);
    } finally { 

    }
  }

  return (
    <AuthContext.Provider value={{ token: accessToken, signIn, signOut, signed, initialLoading }} >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext