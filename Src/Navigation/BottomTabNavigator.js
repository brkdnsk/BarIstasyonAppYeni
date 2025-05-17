import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// 📄 Sayfa bileşenlerini import ediyoruz
import HomePage from '../Screens/HomePage';
import CoffeesPage from '../Screens/CoffeesPage';
import EquipmentsPage from '../Screens/EquipmentsPage';
import JobsPage from '../Screens/JobsPage';
import SettingsPage from '../Screens/SettingsPage';

// 🔧 Bottom Tab Navigator oluşturuluyor
const Tab = createBottomTabNavigator();

// ✅ Navigator bileşeni export ediliyor
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      // 🛠️ Tüm tab ekranları için ortak ayarlar
      screenOptions={({ route }) => ({
        // Her sekmeye özel ikon belirleme
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // 👇 Sekme adına göre ikon belirleniyor
          switch (route.name) {
            case 'AnaSayfa':
              iconName = 'home-outline';
              break;
            case 'Kahveler':
              iconName = 'cafe'; // Ionicons → ☕
              break;
            case 'Ekipmanlar':
              iconName = 'construct-outline';
              break;
            case 'İşİlanları':
              iconName = 'briefcase-outline';
              break;
            case 'Ayarlar':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          // İkon render ediliyor
          return <Icon name={iconName} size={size} color={color} />;
        },

        // Aktif ve pasif renk ayarları
        tabBarActiveTintColor: '#6f4e37',   // Aktif sekme rengi (kahverengi ton)
        tabBarInactiveTintColor: 'gray',   // Pasif sekme rengi
        headerShown: false,                // Üst başlık gizleniyor
      })}
    >
      {/* 🏠 Ana sayfa sekmesi */}
      <Tab.Screen name="AnaSayfa" component={HomePage} />

      {/* ☕ Kahveler sekmesi */}
      <Tab.Screen name="Kahveler" component={CoffeesPage} />

      {/* 🛠️ Ekipmanlar sekmesi */}
      <Tab.Screen name="Ekipmanlar" component={EquipmentsPage} />

      {/* 💼 İş İlanları sekmesi */}
      <Tab.Screen name="İşİlanları" component={JobsPage} />

      {/* ⚙️ Ayarlar sekmesi */}
      <Tab.Screen name="Ayarlar" component={SettingsPage} />
    </Tab.Navigator>
  );
}
