import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import WebView from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const loggedInUserId = 1;

export default function CoffeeDetailsPage({ route, navigation }) {
  const { coffee } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoHeight, setVideoHeight] = useState(windowWidth * 0.5625); // 16:9 aspect ratio

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5220/api/FavoriteRecipe');
      const favorites = await response.json();
      const isCurrentFavorite = favorites.some(
        f => f.userId === loggedInUserId && f.coffeeRecipeId === coffee.id
      );
      setIsFavorite(isCurrentFavorite);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const favorites = await fetch('http://10.0.2.2:5220/api/FavoriteRecipe').then(res => res.json());
        const favorite = favorites.find(f => f.userId === loggedInUserId && f.coffeeRecipeId === coffee.id);
        
        if (favorite) {
          await fetch(`http://10.0.2.2:5220/api/FavoriteRecipe/${favorite.id}`, {
            method: 'DELETE'
          });
        }
      } else {
        await fetch('http://10.0.2.2:5220/api/FavoriteRecipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            coffeeRecipeId: coffee.id
          })
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
      Alert.alert('Hata', 'Favori işlemi gerçekleştirilemedi.');
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube URL'sini embed formatına dönüştür
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('embed/')[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {coffee.imageUrl && (
          <Image
            source={{ uri: coffee.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{coffee.title}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarif Açıklaması</Text>
        <Text style={styles.description}>{coffee.description}</Text>
      </View>

      {coffee.videoUrl && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazırlanış Videosu</Text>
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: getEmbedUrl(coffee.videoUrl) }}
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              onError={() => Alert.alert('Hata', 'Video yüklenirken bir hata oluştu.')}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Malzemeler</Text>
        <Text style={styles.ingredients}>{coffee.ingredients}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazırlanışı</Text>
        <Text style={styles.preparation}>{coffee.preparation}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e342e',
    flex: 1,
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6f4e37',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#5d4037',
    lineHeight: 24,
  },
  ingredients: {
    fontSize: 16,
    color: '#5d4037',
    lineHeight: 24,
  },
  preparation: {
    fontSize: 16,
    color: '#5d4037',
    lineHeight: 24,
  },
  videoContainer: {
    width: '100%',
    height: windowWidth * 0.5625, // 16:9 aspect ratio
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
});
