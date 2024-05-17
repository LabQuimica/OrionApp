import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
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

  const getColorByState = (estado) => {
    switch (estado) {
      case 0:
        return 'red';
      case 1:
        return 'yellow';
      case 2:
        return 'green';
      default:
        return 'white';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: getColorByState(item.estado) }]}>
      <Text>Práctica: {item.practicas.nombre ?? 'N/A'}</Text>
      <Text>Fecha: {item.fecha ?? 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../../assets/imagenP.jpg')} style={styles.image} />
      <FlatList
        data={valesWithPracticas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
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
    marginVertical: 10,
    borderRadius: 5,
  },
});
