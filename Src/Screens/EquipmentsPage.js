import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:5220/api/Equipment')
      .then(async response => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Hata: ${response.status} - ${err}`);
        }
        return response.json();
      })
      .then(data => {
        setEquipments(data);
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
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.label}>Açıklama:</Text>
      <Text style={styles.text}>{item.description}</Text>

      <Text style={styles.label}>Kullanım:</Text>
      <Text style={styles.text}>{item.usage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Ekipmanlar</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6f4e37" />
      ) : (
        <FlatList
          data={equipments}
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
  name: {
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
});
