import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Giriş / Şifre / Kayıt sayfaları
import LoginPage from '../Screens/loginPage';
import RegisterPage from '../Screens/registerPage';
import ForgotPassword from '../Screens/forgotPasswordPage';
import ForgotPassword1 from '../Screens/forgotPasswordPage1';
import ForgotPassword2 from '../Screens/forgotPasswordPage2';

// Ana sekme navigasyonu ve tarif detay sayfası
import BottomTabNavigator from './BottomTabNavigator';
import CoffeeDetailsPage from '../Screens/CoffeeDetailsPage';
import CoffeesPage from '../Screens/CoffeesPage';
import EquipmentsPage from '../Screens/EquipmentsPage';
import JobsPage from '../Screens/JobsPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPassword1} />
        <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="CoffeeDetails" component={CoffeeDetailsPage} />
        <Stack.Screen name="CoffeeListPage" component={CoffeesPage} />
        <Stack.Screen name="EquipmentListPage" component={EquipmentsPage} />
        <Stack.Screen name="JobListPage" component={JobsPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
