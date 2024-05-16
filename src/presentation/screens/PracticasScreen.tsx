import { View, Text, Image, FlatList, StyleSheet  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase'; // Assuming supabase is initialized elsewhere
import { useEffect, useState } from 'react';


const PracticasScreen = () => {
  const [valesWithPracticas, setValesWithPracticas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('vales')
          .select('id,practicas(id, nombre), fecha, estado');

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


  const renderItem = ({ item }) => (
    <View style={{ padding: 30, backgroundColor:'orange'}}>
      <Text >Práctica: {item.practicas.nombre ?? 'N/A'}</Text>
      <Text>Fecha: {item.fecha ?? 'N/A'}</Text>
      
    </View>
  );

  return (
    
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Image source={require('../../../assets/imagenP.jpg')} style={{ height: 300 }} />
        
        <FlatList
        data={valesWithPracticas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
          <Text className='text-black'>{JSON.stringify(valesWithPracticas, null, 2)}</Text>


      </SafeAreaView>
   
  );
};

export default PracticasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'cover',
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});