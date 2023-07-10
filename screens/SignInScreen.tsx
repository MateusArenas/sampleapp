import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import AuthContext from '../contexts/auth';
import React from 'react';

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Animated from 'react-native-reanimated';
import Logo from '../svgs/Logo';

type Inputs = {
  email: string
  password: string
}


export default function SignInScreen() {
  const { signIn } = React.useContext(AuthContext);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      email: "roberto@gmail.com",
      password: "1234",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      await signIn(email, password)
    } catch (error) {
      
    }
  }

  console.log({ SignInScreen: 'render' });

  return (
    <View style={styles.container}>

      <Controller 
        name="email"
        control={control}
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
        control={control}
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

      <Pressable onPress={handleSubmit(onSubmit)}>
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
