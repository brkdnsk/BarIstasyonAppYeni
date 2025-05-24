import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ForgotPassword({ navigation }) {
  const [input, setInput] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>
      <TextInput style={styles.input} placeholder="E-posta veya Telefon" value={input} onChangeText={setInput} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ForgotPassword1')}>
        <Text style={styles.buttonText}>Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ /* aynı style */ });
