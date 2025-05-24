import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ForgotPassword1({ navigation }) {
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>
      <TextInput style={styles.input} placeholder="Kodu Giriniz" value={code} onChangeText={setCode} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ForgotPassword2')}>
        <Text style={styles.buttonText}>Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ /* aynı style */ });
