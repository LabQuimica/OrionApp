import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase'; // Assuming supabase is initialized elsewhere

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
    <View style={styles.itemContainer}>
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
  container: { flex: 1, backgroundColor: 'white' },
  image: { height: 300, width: '100%', resizeMode: 'cover', borderRadius: 10 },
  listContent: { padding: 20 },
  itemContainer: { 
    padding: 20, 
    marginBottom: 20, 
    backgroundColor: '#F5F5DC', 
    borderRadius: 10, 
  },
});
