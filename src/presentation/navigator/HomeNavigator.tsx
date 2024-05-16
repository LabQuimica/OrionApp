import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PracticasScreen from '../screens/PracticasScreen';
import FormularioScreen from '../screens/FormularioScreen';

const Tab = createBottomTabNavigator();

export const HomeNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Practicas" component={PracticasScreen} />
      <Tab.Screen name="Formulario" component={FormularioScreen} />
    </Tab.Navigator>
  );
}