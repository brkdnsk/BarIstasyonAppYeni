import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:5220/api/JobPost')
      .then(async response => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Hata: ${response.status} - ${err}`);
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.company}>{item.companyName} – {item.location}</Text>

      <Text style={styles.label}>Açıklama:</Text>
      <Text style={styles.text}>{item.description}</Text>

      <Text style={styles.label}>İletişim:</Text>
      <Text style={styles.text}>{item.contactEmail}</Text>

      <Text style={styles.date}>Yayın Tarihi: {new Date(item.postedAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>İş İlanları</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6f4e37" />
      ) : (
        <FlatList
          data={jobs}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e342e',
  },
  company: {
    fontSize: 14,
    color: '#6d4c41',
    marginBottom: 8,
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
