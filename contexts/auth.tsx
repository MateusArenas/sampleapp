import React from "react";
import { sleep } from "../utils/sleep";
import * as SecureStore from 'expo-secure-store';
import { apiHandler } from "../services/api";
import api from "../services/api";
import HttpException from "../services/HttpException";

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
        // const accessToken = await SecureStore.getItemAsync('accessToken');

        // if (!accessToken) throw new Error("Access Token not provided in secure store");

        // const [response] = await Promise.all([
        //   apiHandler.authentication({ accessToken }),
        //   sleep(4000)
        // ]);

        // if (!response) throw new Error("Response is empty");

        // api.defaults.headers.common.Authorization = response?.accessToken;

        // await SecureStore.setItemAsync('accessToken', response.accessToken);
        // setAccessToken(response.accessToken);

        // await SecureStore.setItemAsync('user', JSON.stringify(response.user));
        // setUser(response.user);

        // setSigned(true)
      } catch (err) {
        // Restoring token failed
        console.log(err);
      } finally {
        setInitialLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

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
      // if (HttpException.isHttpException(error) && error?.status) {
          
      //   if(error?.status >= 500) {
      //     Alert.simple({
      //       title: 'Erro de conexão',
      //       subtitle: 'Verifique sua conexão com a internet',
      //       accept: () => {}
      //     })
      //   } else if(error?.status >= 400) {
      //     if (error?.status == 404) {
      //       methods.setError('identificador', { message: "Usuário não encontrado" })
      //     } else if (error?.status == 403) {
      //       methods.setError('senha', { message: "Senha incorreta" })
      //     }
      //   } 
      // } else {
      //   Alert.simple({
      //     title: 'Erro de aplicação',
      //     subtitle: 'Verifique se você fez algo errado.',
      //     accept: () => {}
      //   })
      // }
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