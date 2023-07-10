import { sleep } from "../utils/sleep";
import api from "./api";

interface AuthenticationInput {
    accessToken: string
}

interface signInInput {
    email: string
    password: string
}

export const apiHandler = {
    authentication: async (input: AuthenticationInput, options?: any) => {
        try {
            const response = await api.post("/authentication", input, options);
            console.log({ data: response.data });
            
            return response.data;
            // return { user: { id: 10, name: 'Roberto' }, accessToken: "abc1", refreshToken: "abc2" };
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    signIn: async (input: signInInput, options?: any) => {
        try {
            const response = await api.post("/signin", input, options);
            console.log({ data: response.data });

            
            // return { user: { id: 10, name: 'Roberto' }, accessToken: "abc1", refreshToken: "abc2" };
            return response.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    helloWorld: async () => {
        try {
            const response = await api.post("/hello-world");
            console.log({ data: response.data });
            
            // return { user: { id: 10, name: 'Roberto' }, accessToken: "abc1", refreshToken: "abc2" };
            return response.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}