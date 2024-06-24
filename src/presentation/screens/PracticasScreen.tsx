import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase'; // Assuming supabase is initialized elsewhere
import { Session } from '@supabase/supabase-js'
const PracticasScreen = ({ route }) => {
  const { session } = route.params;
  const [valesWithPracticas, setValesWithPracticas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        console.error('ID de usuario no disponible');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('vales_2')
          .select('id,practicas(id, nombre), fecha, estado')
          .eq('id_usuario', session.user.id);

        if (error) {
          throw error;
        }

        setValesWithPracticas(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener datos:', error.message);
        } else {
          console.error('Error desconocido al obtener datos');
        }
      }
    };
    fetchData();
  }, [session?.user?.id]);

  const getColorByState = (estado) => {
    switch (estado) {
        case 0:
            return 'rgba(255, 0, 0, 0.6)'; // Rojo con 50% de transparencia
        case 1:
            return 'rgb(240, 180, 70)'; // Amarillo con 50% de transparencia
        case 2:
            return 'rgba(0, 128, 0, 0.6)'; // Verde con 50% de transparencia
        default:
            return 'rgba(255, 255, 255, 0.6)'; // Blanco con 50% de transparencia
    }
};

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: getColorByState(item.estado) }]}>
      <Text style={styles.title} >Práctica: {item.practicas.nombre ?? 'N/A'}</Text>
      <Text style={styles.subtitle}>Fecha: {item.fecha ?? 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
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
    borderRadius: 20,
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
});
