import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated,
} from 'react-native';

export default function CoffeesPage({ navigation }) {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch('http://10.0.2.2:5220/api/CoffeeRecipe')
      .then(async response => {
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Hata: ${response.status} - ${error}`);
        }
        return response.json();
      })
      .then(data => {
        setCoffees(data);
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
          <Text style={styles.title}>☕ {item.title}</Text>
          <Text style={styles.expandButton}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>

        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        )}

        {isExpanded && (
          <Animated.View style={styles.detailsContainer}>
            <View style={styles.separatorLine} />
            
            <Text style={styles.label}>📝 Tarif Açıklaması</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('CoffeeDetails', { coffee: item })}
            >
              <Text style={styles.detailsButtonText}>🔍 Detaylı Tarifi Gör</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>☕ Kahve Tarifleri</Text>
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
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    flex: 1,
    marginRight: 10,
  },
  expandButton: {
    fontSize: 16,
    color: '#6f4e37',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6f4e37',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
    marginBottom: 15,
  },
  detailsButton: {
    backgroundColor: '#6f4e37',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
