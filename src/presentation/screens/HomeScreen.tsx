import { View, Text, StyleSheet, ScrollView, Button, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [valesWithPracticas, setValesWithPracticas] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('vales_2')
          .select('id, profesores(id,nombre), practicas(id, nombre),fecha');
        if (error) {
          throw error;
        }
        const formattedData = data.map(event => ({
          ...event,
          fecha: event.fecha.replace(/\//g, '-'),
        }));

        setValesWithPracticas(formattedData);
      } catch (error) {
        console.error('Error al obtener datos:', error.message);
      }
    };
    fetchData();
  }, []);



  const markedDates = valesWithPracticas.reduce((acc, event) => {
    acc[event.fecha] = { marked: true, dotColor: 'red' };
    return acc;
  }, {});

  const eventsForSelectedDate = valesWithPracticas.filter(event => event.fecha === selectedDate);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Image source={require('../../../assets/imagenP.jpg')} style={{ height: 300 }} />

      <View className="justify-center items-center">

        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: '#00376b' },
          }}
          className=' w-96 h-96 -mb-1'
        />
        <ScrollView style={styles.eventsContainer}>
          {eventsForSelectedDate.map((event, index) => (
            <View key={index} style={styles.event} >
              <Text style={styles.title}>{event.practicas.nombre}</Text>
              <Text style={styles.subtitle}>{event.profesores.nombre}</Text>
            </View>
          ))}

          <View >
            <Pressable  style={styles.button} onPress={() => navigation.navigate('Formulario')} >
            <Text style={styles.text}> Nuevo </Text>
            </Pressable>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsContainer: {
    marginTop: -50,
    padding: 10,
    marginBottom:160
  },
  event: {
    padding: 20,
    margin: 10,
    flex:1,
    width:370,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 55, 107, 0.6)',

  },
  
  title: {
    color: 'white',
    fontSize: 24, // Tamaño del texto del título
    fontWeight: 'bold', // Peso de la fuente del título
  },
  subtitle: {
    color: 'white',
    fontSize: 18, // Tamaño del texto del subtítulo
    fontWeight: 'normal', // Peso de la fuente del subtítulo
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: '#00376b',
    marginBottom : 10,
    margin : 10
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },


});