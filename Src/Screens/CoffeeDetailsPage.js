import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';

export default function CoffeeDetailsPage({ route }) {
  const { coffee } = route.params;
  const userId = 1; // Giriş yapan kullanıcıyı temsil ediyor
  const [isFavorite, setIsFavorite] = useState(false);
  const [favId, setFavId] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);

  // Favori kontrolü + yorumlar + puan çekimi
  useEffect(() => {
    fetch(`http://10.0.2.2:5220/api/Favorite/User/${userId}`)
      .then(res => res.json())
      .then(data => {
        const fav = data.find(f => f.coffeeRecipeId === coffee.id);
        if (fav) {
          setIsFavorite(true);
          setFavId(fav.id);
        }
      });

    fetch(`http://10.0.2.2:5220/api/Comment/${coffee.id}`)
      .then(res => res.json())
      .then(setComments);

    fetch(`http://10.0.2.2:5220/api/Rating/${coffee.id}`)
      .then(res => res.json())
      .then(setRating);
  }, []);

  const toggleFavorite = () => {
    if (isFavorite) {
      fetch(`http://10.0.2.2:5220/api/Favorite/${favId}`, { method: 'DELETE' })
        .then(() => {
          setIsFavorite(false);
          setFavId(null);
        });
    } else {
      fetch(`http://10.0.2.2:5220/api/Favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coffeeRecipeId: coffee.id })
      })
        .then(res => res.json())
        .then(data => {
          setIsFavorite(true);
          setFavId(data.id);
        });
    }
  };

  const submitComment = () => {
    fetch(`http://10.0.2.2:5220/api/Comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coffeeRecipeId: coffee.id, text: comment })
    })
      .then(() => {
        setComment('');
        return fetch(`http://10.0.2.2:5220/api/Comment/${coffee.id}`);
      })
      .then(res => res.json())
      .then(setComments);
  };

  const submitRating = (star) => {
    fetch(`http://10.0.2.2:5220/api/Rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coffeeRecipeId: coffee.id, rating: star })
    })
      .then(() => setRating(star));
  };

  return (
    <View style={styles.container}>
      {coffee.imageUrl && <Image source={{ uri: coffee.imageUrl }} style={styles.image} />}

      <Text style={styles.title}>{coffee.title}</Text>
      <Text style={styles.description}>{coffee.description}</Text>

      <TouchableOpacity onPress={toggleFavorite}>
        <Text style={styles.favorite}>{isFavorite ? '★ Favoriden Kaldır' : '☆ Favorilere Ekle'}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Puan Ver:</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => submitRating(star)}>
            <Text style={{ fontSize: 24, color: star <= rating ? '#6f4e37' : '#ccc' }}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Yorumlar:</Text>
      <FlatList
        data={comments}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.username || 'Kullanıcı'}:</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <TextInput
        placeholder="Yorum yaz..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <TouchableOpacity onPress={submitComment} style={styles.commentButton}>
        <Text style={styles.commentButtonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f1ea', flex: 1 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4e342e' },
  description: { fontSize: 16, color: '#5d4037', marginVertical: 10 },
  favorite: { fontSize: 16, color: '#6f4e37', marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, color: '#6f4e37' },
  stars: { flexDirection: 'row', marginVertical: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1
  },
  commentButton: {
    backgroundColor: '#8c7051',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  commentButtonText: { color: '#fff', fontWeight: 'bold' },
  commentItem: { paddingVertical: 5 },
  commentUser: { fontWeight: '600' }
});
