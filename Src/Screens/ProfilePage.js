import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const loggedInUserId = 1;

export default function ProfilePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://10.0.2.2:5220/api/User/${loggedInUserId}`);
        if (!res.ok) throw new Error(`Kullanıcı alınamadı: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Kullanıcı verisi hatası:', err.message);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://10.0.2.2:5220/api/FavoriteRecipe`);
        const data = await safeJson(res);
        const userFavorites = data
          .filter(f => f.userId === loggedInUserId)
          .map(f => ({
            id: f.id,
            coffeeRecipeId: f.coffeeRecipeId,
            coffee: f.coffeeRecipe || {}, // coffeeRecipe verisi varsa
          }));
        setFavorites(userFavorites);
      } catch (err) {
        console.error('Favori verisi hatası:', err.message);
      }
    };

    Promise.all([fetchUser(), fetchFavorites()]).finally(() => setLoading(false));
  }, []);

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favItem}
      onPress={() => {
        if (item.coffee?.id) {
          navigation.navigate('CoffeeDetailsPage', { coffee: item.coffee });
        }
      }}
    >
      <Text style={styles.favTitle}>{item.coffee?.title || 'Başlık yok'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6f4e37" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Kullanıcı bilgisi alınamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profilim</Text>

      {user.avatarUrl && (
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      )}

      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {user.bio && (
        <>
          <Text style={styles.label}>Hakkımda:</Text>
          <Text style={styles.text}>{user.bio}</Text>
        </>
      )}

      <Text style={styles.label}>Rol:</Text>
      <Text style={styles.text}>{user.role}</Text>

      <Text style={[styles.label, { marginTop: 20 }]}>Favori Tariflerim:</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={<Text style={styles.text}>Favori tarif bulunamadı.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#6f4e37',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e342e',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#6d4c41',
    textAlign: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#6f4e37',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: '#5d4037',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  favItem: {
    backgroundColor: '#e0d3c2',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  favTitle: {
    color: '#4e342e',
    fontWeight: 'bold',
  },
});
