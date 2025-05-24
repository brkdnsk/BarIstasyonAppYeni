import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

// Giriş yapan kullanıcı varsayılsın
const loggedInUserId = 1; // Gerçek uygulamada token'dan alınır

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://10.0.2.2:5220/api/User/${loggedInUserId}`)
      .then(async response => {
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Hata: ${response.status} - ${error}`);
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      });
  }, []);

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
});
