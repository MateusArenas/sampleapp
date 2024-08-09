import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import AuthContext from '../contexts/auth';
import React from 'react';

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Animated from 'react-native-reanimated';
import Logo from '../svgs/Logo';
import HttpException from '../services/HttpException';
import { Alert } from '../handlers/Alert';

type Inputs = {
  email: string
  password: string
}

export default function SignInScreen() {
  const { signIn } = React.useContext(AuthContext);

  const methods = useForm<Inputs>({
    defaultValues: {
      email: "mateusarenas97@gmail.com",
      password: "123456789",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      await signIn(email, password);
    } catch (error) {
      if (HttpException.isHttpException(error) && error?.status) {
        if(error?.status >= 500) {
          Alert.simple({
            title: 'Erro de conexão',
            subtitle: 'Verifique sua conexão com a internet',
          })
        } else if(error?.status >= 400) {
          if (error?.status == 404) {
            methods.setError('email', { message: "Usuário não encontrado" })
          } else if (error?.status == 403) {
            methods.setError('password', { message: "Senha incorreta" })
          }
        } 
      } else {
        Alert.simple({
          title: 'Erro de aplicação',
          subtitle: 'Verifique se você fez algo errado.',
        })
      }
    }
  }

  console.log({ SignInScreen: 'render' });

  return (
    <View style={styles.container}>

      <Controller 
        name="email"
        control={methods.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={{ padding: 40 }}
          />
        )}
      />

      <Controller 
        name="password"
        control={methods.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Senha"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={{ padding: 40 }}
          />
        )}
      />

      <Pressable onPress={methods.handleSubmit(onSubmit)}>
        {({ pressed }) => (
          <Text style={[pressed && { color: 'red' }]}>signIn</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
