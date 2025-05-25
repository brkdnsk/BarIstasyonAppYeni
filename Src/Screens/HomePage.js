import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';

export default function HomePage({ navigation }) {
  const [dailyCoffee, setDailyCoffee] = useState(null);
  const [dailyJob, setDailyJob] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const jobScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // İş ilanı animasyonu - kahve animasyonu gibi yavaş büyüyüp küçülme
    Animated.loop(
      Animated.sequence([
        Animated.timing(jobScale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(jobScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coffeeRes, jobRes, equipmentRes] = await Promise.all([
          fetch('http://10.0.2.2:5220/api/CoffeeRecipe'),
          fetch('http://10.0.2.2:5220/api/JobPos'),
          fetch('http://10.0.2.2:5220/api/Equipment'),
        ]);
        const coffees = await coffeeRes.json();
        const jobs = await jobRes.json();
        const equipments = await equipmentRes.json();

        if (coffees.length > 0) {
          const randomCoffee = coffees[Math.floor(Math.random() * coffees.length)];
          setDailyCoffee(randomCoffee);
        }
        if (jobs.length > 0) {
          const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
          setDailyJob(randomJob);
        }
        setEquipmentList(equipments);
      } catch (err) {
        console.error('Veri çekme hatası:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6f4e37" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Barİstasyon</Text>

        {/* Günün Kahvesi */}
        {dailyCoffee && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Günün Kahvesi ☕</Text>
            {dailyCoffee.imageUrl && (
              <Image source={{ uri: dailyCoffee.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.itemTitle}>{dailyCoffee.title}</Text>
            <Text style={styles.itemDescription}>{dailyCoffee.description}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CoffeeListPage')}
        >
          <Text style={styles.buttonText}>Tüm Kahveleri Gör</Text>
        </TouchableOpacity>

        {/* İş İlanı */}
        {dailyJob && (
          <Animated.View style={[styles.card, { transform: [{ scale: jobScale }] }]}>
            <Text style={styles.sectionTitle}>İş İlanı 💼</Text>
            <Text style={styles.itemTitle}>{dailyJob.title}</Text>
            <Text style={styles.itemDescription}>{dailyJob.description}</Text>
          </Animated.View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('JobListPage')}
        >
          <Text style={styles.buttonText}>İş İlanlarına Git</Text>
        </TouchableOpacity>

        {/* Ekipmanlar */}
        <View style={[styles.card, { backgroundColor: '#d5f5e3' }]}>
          <Text style={styles.sectionTitle}>Ekipmanlar 🛠️</Text>
          {equipmentList.length === 0 && <Text style={styles.itemDescription}>Ekipman bulunamadı.</Text>}
          {equipmentList.map((eq) => (
            <View key={eq.id} style={{ marginBottom: 10 }}>
              <Text style={styles.itemTitle}>{eq.name}</Text>
              <Text style={styles.itemDescription}>{eq.description}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EquipmentListPage')}
        >
          <Text style={styles.buttonText}>Ekipmanlara Git</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f4f1ea' },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6f4e37',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4e342e',
    marginBottom: 10,
  },
  image: { width: 200, height: 150, borderRadius: 10, marginBottom: 10 },
  itemTitle: { fontSize: 20, fontWeight: '600', color: '#6f4e37', marginBottom: 8, textAlign: 'center' },
  itemDescription: { fontSize: 16, color: '#5d4037', textAlign: 'center' },
  button: {
    backgroundColor: '#6f4e37',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
