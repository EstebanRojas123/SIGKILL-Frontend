import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Text, useTheme } from '@rneui/themed';
import { View, StyleSheet, Alert } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese usuario y contraseña');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://192.168.1.142:3000/auth/signin', {
        email,
        password,
      });
  
      const { accessToken, refreshToken } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
  
      // Obtener el nombre del usuario
      const userResponse = await axios.get(`http://192.168.1.142:3000/user/email/${email}`);
      const userName = userResponse.data.name;
  
      // Almacenar el nombre en AsyncStorage
      await AsyncStorage.setItem('userName', userName);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
      console.log('Login exitoso:', response.data);
      navigation.navigate("Home");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas, vuelva a intentarlo';
      Alert.alert('Error', errorMessage);
      console.error('Error en la petición de login:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h2 style={styles.title}>
        Bienvenido a
      </Text>
      <Text h1 style={styles.appName}>
        SIGKILL Question
      </Text>

      {/* Input para nombre de usuario */}
      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
      />

      {/* Input para contraseña */}
      <Input
        placeholder="Contraseña"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
      />

      {/* Botón de Login */}
      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        loading={loading} // Muestra un spinner cuando está cargando
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    color: '#007bff', // Color del texto del título
    textAlign: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff', // Color del texto de QuestionApp
    textAlign: 'center',
    textShadowColor: 'rgba(0, 123, 255, 0.5)', // Color de la sombra
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 5, // Difuminado de la sombra
    marginBottom: 40,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
  },
});

export default LoginScreen;
