import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomePage({ navigation }) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barİstasyon</Text>
      <TextInput style={styles.input} placeholder="ANASAYFA" />
      
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
  
});