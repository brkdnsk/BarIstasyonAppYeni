import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity 
        style={[
          styles.itemContainer,
          isExpanded && styles.itemContainerExpanded
        ]} 
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>💼 {item.title}</Text>
            <Text style={styles.company}>
              <Text style={styles.companyName}>🏢 {item.companyName}</Text>
              <Text style={styles.separator}> • </Text>
              <Text>📍 {item.location}</Text>
            </Text>
          </View>
          <Text style={styles.expandButton}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>

        {isExpanded && (
          <Animated.View style={styles.detailsContainer}>
            <View style={styles.separatorLine} />
            
            <Text style={styles.label}>📝 Açıklama</Text>
            <Text style={styles.text}>{item.description}</Text>

            <Text style={styles.label}>📧 İletişim</Text>
            <Text style={styles.text}>{item.contactEmail}</Text>

            <Text style={styles.date}>
              📅 Yayın Tarihi: {new Date(item.postedAt).toLocaleDateString('tr-TR')}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>💼 İş İlanları</Text>
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
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6f4e37',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemContainerExpanded: {
    backgroundColor: '#fff',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#6d4c41',
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    color: '#6d4c41',
  },
  separator: {
    color: '#8d6e63',
    marginHorizontal: 5,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  expandButton: {
    fontSize: 16,
    color: '#6f4e37',
    paddingTop: 2,
  },
  detailsContainer: {
    marginTop: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6f4e37',
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#8d6e63',
    marginTop: 12,
    textAlign: 'right',
  },
});
