import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase'; 
import { Session } from '@supabase/supabase-js'

const PracticasScreen = ({ route }) => {
  const { session } = route.params;
  const [valesWithPracticas, setValesWithPracticas] = useState<any[]>([]);
  const [touchableDimensions, setTouchableDimensions] = useState({ width: 0, height: 0 });
  const [openStartDatePicker, setOpenStartDatePiker] = useState(false);

  useEffect(() => {
    fetchPractices();
  }, [session?.user?.id]);

  const fetchPractices = async () => {
    if (!session?.user?.id) {
      console.error('ID de usuario no disponible');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vales_2')
        .select('id, practicas(id, nombre), fecha, estado, profesores(id, nombre)')
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

  const onTouchableLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setTouchableDimensions({ width, height });
  };

  const dynamicMargins = {
    marginHorizontal: touchableDimensions.width * 0.05, // Ejemplo: 5% del ancho
    marginVertical: touchableDimensions.height * 0.1, // Ejemplo: 5% del alto
    height: touchableDimensions.height * 0.8, // Ejemplo: 90% del alto
  };

  const onPress = () => setOpenStartDatePiker(!openStartDatePicker);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.itemContainer]} onPress={onPress} onLayout={onTouchableLayout}>
      <View style={[styles.itemContainer2, { backgroundColor: getColorByState(item.estado) }, dynamicMargins]}></View>
      <Text style={styles.title} >Práctica: {item.practicas?.nombre ?? 'N/A'}</Text>
      <Text style={styles.subtitle}>Fecha: {item.fecha ?? 'N/A'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={valesWithPracticas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={openStartDatePicker}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Despliegue de materiales por práctica</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpenStartDatePiker(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PracticasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    color: 'black',
    fontSize: 20, // Tamaño del texto del título
    fontWeight: 'bold', // Peso de la fuente del título
  },
  subtitle: {
    color: 'black',
    fontSize: 18, // Tamaño del texto del subtítulo
    fontWeight: 'normal', // Peso de la fuente del subtítulo
  },
  itemContainer2: {
    width: 15,
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'black',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
