import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function HomePage() {
  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Barİstasyon</Text>
        <Text style={styles.subtitle}>Günün Kahvesi ☕</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latte</Text>
          <Text style={styles.cardText}>
            Süt ve espressonun muazzam birleşimi. Hafif içimli, kremams bir tat.
          </Text>
        </View>

        <Text style={styles.subtitle}>Sana Özel Tavsiyeler</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cold Brew Denedin mi?</Text>
          <Text style={styles.cardText}>
            Soğuk demleme tekniğiyle hazırlanan bu kahve, düşük asidite ve yumuşak içimiyle ideal!
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Tüm Kahveleri Gör</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6f4e37',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b5c42',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4e342e',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#6f4e37',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
