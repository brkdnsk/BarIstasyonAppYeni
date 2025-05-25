import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

export default function CoffeeDetailsPage({ route }) {
  const { coffee } = route.params;
  const userId = 1;

  const [isFavorite, setIsFavorite] = useState(false);
  const [favId, setFavId] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [myRating, setMyRating] = useState(0);

  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  };

  useEffect(() => {
    fetch(`http://10.0.2.2:5220/api/FavoriteRecipe`)
      .then(safeJson)
      .then(data => {
        const fav = data?.find(f => f.userId === userId && f.coffeeRecipeId === coffee.id);
        if (fav) {
          setIsFavorite(true);
          setFavId(fav.id);
        }
      })
      .catch(err => console.log('Favori alınamadı:', err.message));

    fetch(`http://10.0.2.2:5220/api/Review/recipe/${coffee.id}`)
      .then(safeJson)
      .then(data => {
        if (data) setComments(data);
      })
      .catch(err => console.log('Yorum alınamadı:', err.message));

    fetch(`http://10.0.2.2:5220/api/Rating/average/${coffee.id}`)
      .then(safeJson)
      .then(data => {
        if (data?.average !== undefined) setRating(data.average);
      })
      .catch(err => console.log('Puan alınamadı:', err.message));
  }, []);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await fetch(`http://10.0.2.2:5220/api/FavoriteRecipe/${favId}`, { method: 'DELETE' });
        setIsFavorite(false);
        setFavId(null);
      } else {
        const res = await fetch(`http://10.0.2.2:5220/api/FavoriteRecipe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, coffeeRecipeId: coffee.id }),
        });
        const data = await safeJson(res);
        if (data?.id) {
          setIsFavorite(true);
          setFavId(data.id);
        }
      }
    } catch (err) {
      Alert.alert('Favori Hatası', 'Favori işlemi başarısız.');
    }
  };

  const submitComment = () => {
    if (!comment.trim()) return;

    fetch(`http://10.0.2.2:5220/api/Review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coffeeRecipeId: coffee.id, text: comment }),
    })
      .then(() => fetch(`http://10.0.2.2:5220/api/Review/recipe/${coffee.id}`))
      .then(safeJson)
      .then(data => {
        if (data) {
          setComments(data);
          setComment('');
        }
      })
      .catch(err => console.log('Yorum gönderme hatası:', err.message));
  };

  const submitRating = (score) => {
    fetch(`http://10.0.2.2:5220/api/Rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coffeeRecipeId: coffee.id, score }),
    })
      .then(() => {
        setMyRating(score);
        return fetch(`http://10.0.2.2:5220/api/Rating/average/${coffee.id}`);
      })
      .then(safeJson)
      .then(data => {
        if (data?.average !== undefined) setRating(data.average);
      })
      .catch(err => Alert.alert('Puanlama Hatası', err.message));
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUser}>{item.username || 'Kullanıcı'}:</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={comments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderCommentItem}
      ListHeaderComponent={
        <>
          {coffee.imageUrl && (
            <Image source={{ uri: coffee.imageUrl }} style={styles.image} />
          )}
          <Text style={styles.title}>{coffee.title}</Text>
          <Text style={styles.description}>{coffee.description}</Text>

          <TouchableOpacity onPress={toggleFavorite}>
            <Text style={styles.favorite}>
              {isFavorite ? '★ Favoriden Kaldır' : '☆ Favorilere Ekle'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Ortalama Puan: {rating.toFixed(1)} / 5
          </Text>

          <Text style={styles.sectionTitle}>Senin Puanın:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => submitRating(star)}
                disabled={myRating > 0}
              >
                <Text style={{
                  fontSize: 24,
                  color: star <= myRating ? '#6f4e37' : '#ccc'
                }}>
                  {star <= myRating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Yorumlar:</Text>
        </>
      }
      ListFooterComponent={
        <>
          <TextInput
            placeholder="Yorum yaz..."
            value={comment}
            onChangeText={setComment}
            style={styles.input}
          />
          <TouchableOpacity onPress={submitComment} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>Gönder</Text>
          </TouchableOpacity>
        </>
      }
      ListEmptyComponent={<Text style={{ color: '#666' }}>Henüz yorum yapılmamış.</Text>}
    />
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
    borderWidth: 1,
  },
  commentButton: {
    backgroundColor: '#8c7051',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  commentButtonText: { color: '#fff', fontWeight: 'bold' },
  commentItem: { paddingVertical: 5 },
  commentUser: { fontWeight: '600' },
});
