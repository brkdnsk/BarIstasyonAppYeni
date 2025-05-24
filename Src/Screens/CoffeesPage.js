import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, ScrollView } from 'react-native';

export default function CoffeesPage() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:5220/api/CoffeeRecipe')
      .then(response => response.json())
      .then(data => {
        setCoffees(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.label}>Açıklama:</Text>
      <Text style={styles.text}>{item.description}</Text>

      <Text style={styles.label}>Demleme Yöntemi:</Text>
      <Text style={styles.text}>{item.method}</Text>

      <Text style={styles.label}>Demleme Süresi:</Text>
      <Text style={styles.text}>{item.brewTime} dakika</Text>

      <Text style={styles.label}>Malzemeler:</Text>
      <Text style={styles.text}>{item.ingredients}</Text>

      <Text style={styles.date}>Tarih: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Kahve Tarifleri</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6f4e37" />
      ) : (
        <FlatList
          data={coffees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6f4e37',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#6f4e37',
    marginTop: 4,
  },
  text: {
    fontSize: 14,
    color: '#5d4037',
  },
  date: {
    fontSize: 12,
    color: '#8d6e63',
    marginTop: 10,
    textAlign: 'right',
  },
});
