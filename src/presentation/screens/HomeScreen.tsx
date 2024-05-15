import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  Ionicons  from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar } from 'react-native-calendars';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [valesWithPracticas, setValesWithPracticas] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('vales')
          .select('id, id_usuario, practicas(id, nombre),fecha');
        if (error) {
          throw error;
        }
        setValesWithPracticas(data); 
      } catch (error) {
        console.error('Error al obtener datos:', error.message);
      }
    };
    fetchData();
  }, []);


  const markedDates = valesWithPracticas.reduce((acc, event) =>{
    acc[event.fecha] = {marked: true, dotColor : 'red'};
    return acc;
  },{});

  const eventsForSelectedDate = valesWithPracticas.filter(event => event.fecha === selectedDate);
  console.log(JSON.stringify(valesWithPracticas))

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
    <Image source={require('../../../assets/imagenP.jpg')} style={{height:300}}/>
    
    <View className="justify-center items-center">
     
     <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
      />

<Ionicons name="airplane-outline" color={'black'} size={30} />

      <ScrollView style={styles.eventsContainer}>
        {eventsForSelectedDate.map((event, index) => (
          <View key={index} style={styles.event}>
            <Text  >{event.practicas.nombre}</Text>
            <Text  >{event.id_usuario}</Text>
          </View>
        ))}

<View style={styles.buttonContainer}>
          <Button title="Nuevo" onPress={() => console.log('Botón presionado')} />
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
    marginTop: 10,
    padding: 10,
  },
  event: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'blue',
  },
  buttonContainer: {
    marginTop: 10,
  },
});