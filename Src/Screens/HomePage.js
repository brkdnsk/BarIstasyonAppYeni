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
  FlatList,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { ChatService } from '../Services/ChatService';

const windowWidth = Dimensions.get('window').width;

export default function HomePage({ navigation }) {
  const [allCoffees, setAllCoffees] = useState([]);
  const [dailyCoffee, setDailyCoffee] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    recipes: 0,
    equipment: 0,
    jobs: 0
  });
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [question, setQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatService = new ChatService();

  useEffect(() => {
    Promise.all([
      fetch('http://10.0.2.2:5220/api/CoffeeRecipe'),
      fetch('http://10.0.2.2:5220/api/Equipment'),
      fetch('http://10.0.2.2:5220/api/JobPost')
    ])
      .then(async ([coffeeRes, equipmentRes, jobsRes]) => {
        const coffeeData = await coffeeRes.json();
        const equipmentData = await equipmentRes.json();
        const jobsData = await jobsRes.json();
        
        setAllCoffees(coffeeData);
        setStats({
          recipes: coffeeData.length,
          equipment: equipmentData.length,
          jobs: jobsData.length
        });
        
        if (coffeeData.length > 0) {
          const randomIndex = Math.floor(Math.random() * coffeeData.length);
          setDailyCoffee(coffeeData[randomIndex]);
        }
        
        setEquipment(equipmentData.slice(0, 2));
        setJobs(jobsData.slice(0, 2));
      })
      .catch(err => console.error('Veri yüklenirken hata:', err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { 
          toValue: 1.02, 
          duration: 3000, 
          useNativeDriver: true 
        }),
        Animated.timing(scaleAnim, { 
          toValue: 1.0, 
          duration: 3000, 
          useNativeDriver: true 
        }),
      ])
    ).start();
  }, []);

  const renderEquipmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.equipmentCard}
      onPress={() => navigation.navigate('EquipmentListPage', { equipment: item })}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.equipmentImage} />
      )}
      <Text style={styles.equipmentTitle}>{item.name}</Text>
      <Text style={styles.equipmentDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('EquipmentListPage', { equipment: item })}
      >
        <Text style={styles.viewButtonText}>Detayları Gör</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderJobItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobListPage', { job: item })}
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.companyName} - {item.location}</Text>
      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('JobListPage', { job: item })}
      >
        <Text style={styles.viewButtonText}>İlanı Görüntüle</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsChatLoading(true);
    try {
      const response = await chatService.askQuestion(question);
      setChatResponse(response);
    } catch (error) {
      console.error('Soru sorma hatası:', error);
      setChatResponse('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6f4e37" />
      </View>
    );
  }

  if (!dailyCoffee) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Günün Kahvesi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.scroll}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
          style={styles.welcomeBanner}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <Image 
              source={require('../assets/image/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.bannerTitle}>Baristasyon'a Hoş Geldiniz</Text>
            <Text style={styles.bannerSubtitle}>
              Kahve kültürüne dair her şey bir tık uzağınızda!
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {/* Günün Kahvesi Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.cardTitle}>Günün Kahvesi ☕</Text>
              {dailyCoffee.imageUrl && (
                <Image source={{ uri: dailyCoffee.imageUrl }} style={styles.coffeeImage} />
              )}
              <Text style={styles.coffeeTitle}>{dailyCoffee.title}</Text>
              <Text style={styles.cardText}>{dailyCoffee.description}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('CoffeeListPage')}
              >
                <Text style={styles.buttonText}>Tüm Kahveleri Gör</Text>
              </TouchableOpacity>
            </View>

            {/* ChatBot Section */}
            <View style={styles.chatSection}>
              <Text style={styles.sectionTitle}>🤖 Kahve Asistanı</Text>
              <View style={styles.chatContainer}>
                {chatResponse ? (
                  <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>{chatResponse}</Text>
                  </View>
                ) : null}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Kahve hakkında bir soru sorun..."
                    value={question}
                    onChangeText={setQuestion}
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, { opacity: isChatLoading ? 0.7 : 1 }]}
                    onPress={handleAskQuestion}
                    disabled={isChatLoading}
                  >
                    {isChatLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.sendButtonText}>Gönder</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Ekipmanlar Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>🛠️ Ekipmanlar</Text>
              <FlatList
                data={equipment}
                renderItem={renderEquipmentItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EquipmentListPage')}
              >
                <Text style={styles.buttonText}>Tüm Ekipmanları Gör</Text>
              </TouchableOpacity>
            </View>

            {/* İş İlanları Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>💼 En Yeni İş İlanları</Text>
              <FlatList
                data={jobs}
                renderItem={renderJobItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('JobListPage')}
              >
                <Text style={styles.buttonText}>Tüm İlanları Gör</Text>
              </TouchableOpacity>
            </View>

            {/* Demleme İpuçları Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>☕ Demleme İpuçları</Text>
              <View style={styles.tipsContainer}>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>🌡️ Su Sıcaklığına Dikkat</Text>
                  <Text style={styles.tipText}>Kahve demlemede su sıcaklığı 90-96°C arası olmalı. Daha yüksek sıcaklık acılığa neden olabilir.</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>⚖️ Doğru Ölçüm</Text>
                  <Text style={styles.tipText}>Kahve-su oranı önemlidir. Genellikle 1:15 oranı önerilir (1 gram kahveye 15 gram su).</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>🌀 Dairesel Döküm</Text>
                  <Text style={styles.tipText}>Filtre kahvede dairesel hareketlerle su dökerek daha dengeli demleme sağlayabilirsiniz.</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>⏰ Ön Islatma (Blooming)</Text>
                  <Text style={styles.tipText}>Demlemeye başlamadan önce kahveyi 30 saniye ön ıslatmak, aromaların açığa çıkmasını sağlar.</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>🧹 Ekipman Temizliği</Text>
                  <Text style={styles.tipText}>Her demlemeden sonra ekipmanlarını temizlemek, kahvenin tadını bozabilecek kalıntıları engeller.</Text>
                </View>
                <View style={styles.tipCard}>
                  <Text style={styles.tipTitle}>🌱 Taze Öğütme</Text>
                  <Text style={styles.tipText}>Kahve çekirdeklerini demlemeden hemen önce öğütmek, en yoğun aroma ve tazeliği sunar.</Text>
                </View>
              </View>
            </View>

            {/* Baristasyon Hakkında Section */}
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.aboutBackground}
              resizeMode="cover"
            >
              <View style={styles.aboutOverlay}>
                <Text style={[styles.sectionTitle, { color: '#fff' }]}>☕ Baristasyon Hakkında</Text>
                <Text style={[styles.aboutText, { color: '#fff' }]}>
                  Baristasyon, kahve kültürünü teknolojiyle buluşturan dijital bir platformdur. 
                  Amacımız sadece tarif sunmak değil; bir topluluk oluşturmak, sizi bir fincanın 
                  etrafında birleştirmek.
                </Text>
                <View style={[styles.statsContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#fff' }]}>{stats.recipes}</Text>
                    <Text style={[styles.statLabel, { color: '#fff' }]}>Tarif</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#fff' }]}>{stats.equipment}</Text>
                    <Text style={[styles.statLabel, { color: '#fff' }]}>Ekipman</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#fff' }]}>{stats.jobs}</Text>
                    <Text style={[styles.statLabel, { color: '#fff' }]}>İş İlanı</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Image 
                source={require('../assets/image/Logo.png')}
                style={styles.footerLogo}
                resizeMode="contain"
              />
              <Text style={styles.footerText}>© 2025 Baristasyon - Tüm Hakları Saklıdır.</Text>
              <View style={styles.footerCredits}>
                <Text style={styles.footerText}>Kodlayan: </Text>
                <Text style={styles.footerLink}>Senin Adın</Text>
                <Text style={styles.footerText}> • Powered by ASP.NET Core</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  container: {
    flex: 1,
  },
  welcomeBanner: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 15,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4e342e',
    marginBottom: 10,
    textAlign: 'center',
  },
  coffeeImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  coffeeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6f4e37',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#5d4037',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  chatSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4e342e',
    marginBottom: 15,
    textAlign: 'left',
  },
  chatContainer: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#6f4e37',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  responseContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  responseText: {
    fontSize: 16,
    color: '#4e342e',
    lineHeight: 22,
  },
  equipmentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4e342e',
    marginBottom: 4,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#5d4037',
    marginBottom: 8,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4e342e',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#5d4037',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#5d4037',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#6f4e37',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: '#8d6e63',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  aboutBackground: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  aboutOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 15,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6f4e37',
  },
  statLabel: {
    fontSize: 14,
    color: '#8d6e63',
    marginTop: 4,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleWithIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4e342e',
  },
  tipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4e342e',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#4e342e',
    padding: 20,
    width: '100%',
    marginHorizontal: -15,
    marginBottom: -15,
  },
  footerContent: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  footerCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#ffd700',
    fontSize: 12,
  },
});
