import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ForgotPassword2({ navigation }) {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>
      <TextInput style={styles.input} placeholder="Yeni Şifre" value={pass} onChangeText={setPass} secureTextEntry />
      <TextInput style={styles.input} placeholder="Yeni Şifre Tekrar" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Değiştir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ /* aynı style */ });
