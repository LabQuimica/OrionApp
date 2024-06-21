import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PracticasScreen from '../screens/PracticasScreen';
import FormularioScreen from '../screens/FormularioScreen';
import Account from '../components/Account';
import Ionicons from '@expo/vector-icons/Ionicons'

const BottomTab = createBottomTabNavigator();

function AccountWrapper({ route }) {
  const { session } = route.params;
  return <Account key={session.user.id} session={session} />;
}

export const HomeNavigator = ({ session }) => {
  return (
    <BottomTab.Navigator initialRouteName="Home" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
    }}>
      <BottomTab.Screen 
          name="Home" 
          component={HomeScreen} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={26} />
            ),
          }} />

      <BottomTab.Screen 
          name="Practicas" 
          component={PracticasScreen} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "documents" : "documents-outline"} color={color} size={26} />
            ),
          }} />

      <BottomTab.Screen 
          name="Formulario" 
          component={FormularioScreen}
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "newspaper" : "newspaper-outline"} color={color} size={26} />
            ),
          }} />

      <BottomTab.Screen 
          name="Perfil" 
          component={AccountWrapper} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color={color} size={26} />
            ),
          }} />
    </BottomTab.Navigator>

    
  );
}