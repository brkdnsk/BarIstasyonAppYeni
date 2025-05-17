import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CoffeesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kahveler Sayfası</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#6f4e37',
  },
});
