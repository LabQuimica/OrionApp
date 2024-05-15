import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  Ionicons  from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar } from 'react-native-calendars';
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

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
    <Ionicons name="airplane-outline" color={'white'} size={30} />
    
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
      <ScrollView style={styles.eventsContainer}>
        {eventsForSelectedDate.map((event, index) => (
          <View key={index} style={styles.event}>
            <Text  >{event.practicas.nombre}</Text>
            <Text  >{event.id_usuario}</Text>
          </View>
        ))}
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
  eventsContainer: {
    marginTop: 10,
    padding: 10,
  },
  event: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:'blue',
    
  },
});