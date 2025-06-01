import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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
          <Text style={styles.name}>⚒️ {item.name}</Text>
          <Text style={styles.expandButton}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>

        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {isExpanded && (
          <Animated.View style={styles.detailsContainer}>
            <View style={styles.separatorLine} />
            
            <Text style={styles.label}>📝 Açıklama</Text>
            <Text style={styles.text}>{item.description}</Text>

            <View style={styles.separatorLine} />

            <Text style={styles.label}>📖 Kullanım Kılavuzu</Text>
            <Text style={styles.text}>{item.usage}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>⚒️ Kahve Ekipmanları</Text>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    flex: 1,
  },
  expandButton: {
    fontSize: 16,
    color: '#6f4e37',
    paddingLeft: 10,
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
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
  },
});
