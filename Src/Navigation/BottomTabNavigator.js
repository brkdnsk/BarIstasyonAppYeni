import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Sayfa bileşenleri
import HomePage from '../Screens/HomePage';
import CoffeesPage from '../Screens/CoffeesPage';
import EquipmentsPage from '../Screens/EquipmentsPage';
import JobsPage from '../Screens/JobsPage';
import ProfilePage from '../Screens/ProfilePage';

// PNG ikonları import et
import iconHome from '../assets/icon/home-icon-silhouette.png';
import iconCoffee from '../assets/icon/cup-of-drink.png';
import iconEquip from '../assets/icon/v60.png';
import iconJob from '../assets/icon/barista.png';
import iconProfile from '../assets/icon/user.png';

// Tab navigator oluştur
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconSource;

          switch (route.name) {
            case 'AnaSayfa':
              iconSource = iconHome;
              break;
            case 'Kahveler':
              iconSource = iconCoffee;
              break;
            case 'Ekipmanlar':
              iconSource = iconEquip;
              break;
            case 'İşİlanları':
              iconSource = iconJob;
              break;
            case 'Profilim':
              iconSource = iconProfile;
              break;
            default:
              iconSource = iconHome;
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: focused ? size + 2 : size,
                height: focused ? size + 2 : size,
                tintColor: focused ? '#6f4e37' : 'gray',
              }}
            />
          );
        },
        tabBarActiveTintColor: '#6f4e37',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="AnaSayfa" component={HomePage} />
      <Tab.Screen name="Kahveler" component={CoffeesPage} />
      <Tab.Screen name="Ekipmanlar" component={EquipmentsPage} />
      <Tab.Screen name="İşİlanları" component={JobsPage} />
      <Tab.Screen name="Profilim" component={ProfilePage} />
    </Tab.Navigator>
  );
}
