import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/rootStackNavigation';

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar el nombre del usuario de AsyncStorage
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name);
    };

    fetchUserName();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.animatedView, opacity: fadeAnim }}>
        <Text style={styles.motivationalText}>
          {userName ? `¡Bienvenido ${userName} estas muy guapo hoy😍!` : "Cargando..."}
        </Text>
      </Animated.View>

      <Button
        title="Comenzar"
        onPress={() => navigation.navigate('Initial')}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  animatedView: {
    marginBottom: 30,
  },
  motivationalText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
