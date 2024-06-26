import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';
import { Searchbar } from 'react-native-paper';
import { parse, isValid, format } from 'date-fns';

const PracticasScreen = ({ route }) => {
  const { session } = route.params;
  const [valesWithPracticas, setValesWithPracticas] = useState([]);
  const [openStartDatePicker, setOpenStartDatePiker] = useState(false);
  const [dimensions, setDimensions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions1, setDimensions1] = useState({});

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
      console.error('Error al obtener datos:', error.message);
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

  const onTouchableLayout = (event, id) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions(prev => ({ ...prev, [id]: { width, height } }));
  };

  const dynamicMargins = (id) => {
    const { width, height } = dimensions[id] || { width: 0, height: 0 };
    return {
      marginHorizontal: width * 0.05, // Ejemplo: 5% del ancho
      marginVertical: height * 0.1, // Ejemplo: 10% del alto
      height: height * 0.8, // Ejemplo: 80% del alto
    };
  };

  const onPress = () => setOpenStartDatePiker(!openStartDatePicker);

  const tryParseDate = (input) => {
    const formats = ['yyyy-MM-dd', 'dd-MM-yyyy', 'MM/dd/yyyy'];
    for (const formatString of formats) {
      const parsedDate = parse(input, formatString, new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd');
      }
    }
    return input; // return the input if no date format matched
  };

  const filteredPractices = valesWithPracticas.filter(item => {
    const practiceName = item.practicas?.nombre?.toLowerCase() || '';
    const professorName = item.profesores?.nombre?.toLowerCase() || '';
    const date = item.fecha || '';
    const normalizedSearchQuery = tryParseDate(searchQuery.toLowerCase());

    return practiceName.includes(searchQuery.toLowerCase()) ||
      professorName.includes(searchQuery.toLowerCase()) ||
      date.includes(normalizedSearchQuery);
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.itemContainer]} onPress={onPress} onLayout={(event) => onTouchableLayout(event, item.id)}>
      <View style={[styles.itemContainer2, { backgroundColor: getColorByState(item.estado) }, dynamicMargins(item.id)]}></View>
      <Text style={styles.title}>Práctica: {item.practicas?.nombre ?? 'N/A'}</Text>
      <Text style={styles.subtitle}>Profesor: {item.profesores.nombre ?? 'N/A'}</Text>
      <Text style={styles.subtitle}>Fecha: {item.fecha ?? 'N/A'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleF}>
        <Text style={styles.title1}>Prácticas</Text>
      </View>
      <Searchbar
        style={{ margin: 10, borderRadius: 20, elevation: 3, backgroundColor: '#fff', borderColor: '#ccc', marginHorizontal: 20 }}
        placeholder="Buscar"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {filteredPractices.length === 0 ? (
        <Text style={styles.noPracticesText}>No existen prácticas que coincidan con la búsqueda</Text>
      ) : (
        <FlatList
          data={filteredPractices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    color: 'black',
    fontSize: 18, // Tamaño del texto del título
    fontWeight: 'bold', // Peso de la fuente del título
  },
  subtitle: {
    color: 'black',
    fontSize: 16, // Tamaño del texto del subtítulo
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
  noPracticesText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    marginTop: 20,
  },
  titleF: {
    marginBottom: 10,
    marginTop: 45,
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});
