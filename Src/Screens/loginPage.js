import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginPage({ navigation }) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>
      <TextInput style={styles.input} placeholder="E-posta" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry />
      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate('Home')}
      >
      <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#5e4b3c',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#8c7051',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPasswordText: {
    color: '#8c7051',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
  },
});