import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function RegisterPage({ navigation }) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');

  const handleRegister = () => {
    if (sifre !== sifreTekrar) {
      Alert.alert("Hata", "Şifreler uyuşmuyor");
      return;
    }

    const newUser = {
      username: `${ad} ${soyad}`,
      email: email,
      password: sifre,
      bio: telefon,
      role: "user"
    };

    fetch('http://10.0.2.2:5220/api/User/Register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        Alert.alert("Kayıt Başarılı", "Giriş yapabilirsiniz.");
        navigation.replace('Login');
      })
      .catch(err => {
        Alert.alert("Kayıt Hatası", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>

      <TextInput style={styles.input} placeholder="Ad" value={ad} onChangeText={setAd} />
      <TextInput style={styles.input} placeholder="Soyad" value={soyad} onChangeText={setSoyad} />
      <TextInput style={styles.input} placeholder="Telefon Numarası" value={telefon} onChangeText={setTelefon} />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={sifre} onChangeText={setSifre} />
      <TextInput style={styles.input} placeholder="Şifre Tekrar" secureTextEntry value={sifreTekrar} onChangeText={setSifreTekrar} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.forgotPasswordText}>Zaten Hesabın Var Mı? Giriş Yap!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f1ea",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#5e4b3c",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#8c7051",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "#8c7051",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
  }
});
