import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../Screens/loginPage'; 
import ForgotPassword from '../Screens/forgotPasswordPage';
import ForgotPassword1 from '../Screens/forgotPasswordPage1';
import ForgotPassword2 from '../Screens/forgotPasswordPage2';
import HomePage from '../Screens/HomePage';
import RegisterPage from '../Screens/registerPage';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPassword1} />
        <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Register" component={RegisterPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;