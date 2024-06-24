import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Button, Snackbar } from 'react-native-paper';
import { supabase } from '../../../lib/supabase';
import { StyleSheet, TextInput, View, Text, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import DatePiker from 'react-native-modern-datepicker';
import { useNavigation } from '@react-navigation/native';


export default function FormularioScreen({route}) {
    const { session } = route.params;
    const [openStartDatePicker, setOpenStartDatePiker] = useState(false);
    const [minStartDate, setMinStartDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const { control, handleSubmit, setValue, reset, clearErrors } = useForm();
    const [selectedPractice, setSelectedPractice] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        setMinStartDate(today);
    
        if (session && session.user && session.user.id) {
            setUsername(session.user.email);
        } else {
            Alert.alert("Error", "La sesión no está disponible. Por favor, inicia sesión de nuevo.");
        }
    }, [session]);

    const handleOnPressStartDate = () => {
        setOpenStartDatePiker(!openStartDatePicker);
    }

    const options = {
        mainColor: "#469ab6",
        borderColor: 'rgba(122,146,165,0.1)'
    }

    const navigation = useNavigation();

    const onSubmit = async (data1) => {
        if (!session || !session.user.id) {
            Alert.alert("Error", "La sesión no está disponible. Por favor, inicia sesión de nuevo.");
            return;
        }

        if (!data1.id_practica || !data1.grupo || !data1.ua || !data1.fecha || !data1.id_profesor) {
            Alert.alert("Error", "Por favor, completa todos los campos antes de confirmar.");
            return;
        }

        data1.id_usuario = session.user.id;

        try {
            const { data, error } = await supabase
                .from("vales_2")
                .insert([data1]);
            if (error) throw error;
            console.log("Data inserted:", data);
            Alert.alert("Éxito", "Datos ingresados correctamente");
            reset(); 
            clearErrors(); 
            setSelectedStartDate(""); 

        } catch (error) {
            console.error("Error inserting data:", error.message);
            Alert.alert("Error", `Error al insertar datos: ${error.message}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style= {styles.titleF}>
                    <Text style={styles.title}>Formulario</Text>
                </View>
                
                <Text style={styles.label}>Nombre del docente:</Text>
                
                <Controller
                    control={control}
                    name="id_profesor"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.input1}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                                onChange(itemValue);
                                setSelectedPractice(itemValue);
                            }}
                        >
                            <Picker.Item label="Seleccione una opción" value="" />
                            <Picker.Item label="Ramon Ramirez" value="1" />
                            <Picker.Item label="Dante Zapata" value="2" />
                            <Picker.Item label="Mauel Rodriguez" value="3" />
                            <Picker.Item label="Daleth Rojo" value="4" />
                        </Picker>
                        </View>
                    )}
                />

                <Text style={styles.label}>Nombre de la práctica:</Text>
                <Controller
                    control={control}
                    name="id_practica"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.input1}>
                            <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                                onChange(itemValue);
                                setSelectedPractice(itemValue);
                            }}
                        >
                            <Picker.Item label="Seleccione una opción" value="" />
                            <Picker.Item label="Practica prueba" value="1" />
                            <Picker.Item label="Realizar juegos de colores" value="2" />
                            <Picker.Item label="Decantación" value="3" />
                            <Picker.Item label="Microbilogía" value="4" />
                        </Picker>
                        </View>
                    )}
                />

                <Text style={styles.label}>Grupo:</Text>
                <Controller
                    control={control}
                    name="grupo"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Text style={styles.label}>Unidad Aacadémica:</Text>
                <Controller
                    control={control}
                    name="ua"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Text style={styles.label}>Fecha de la práctica:</Text>
                <Controller
                    control={control}
                    name="fecha"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={handleOnPressStartDate}>
                                <Text style={styles.dateButtonText}>
                                    {value || "Seleccionar Fecha"}
                                </Text>
                            </TouchableOpacity>
                            <Modal
                                animationType='slide'
                                transparent={true}
                                visible={openStartDatePicker}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <DatePiker
                                            mode="calendar"
                                            minimumDate={minStartDate.toISOString()}
                                            selected={selectedStartDate}
                                            onDateChange={(date) => {
                                                setSelectedStartDate(date);
                                                setValue("fecha", date);  // Actualiza el valor en react-hook-form
                                            }}
                                            options={options}
                                        />
                                        <TouchableOpacity style={styles.closeButton} onPress={() => setOpenStartDatePiker(false)}>
                                            <Text style={styles.closeButtonText}>Cerrar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.submitButtonText}>Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        marginTop: 5,
        marginStart: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 18,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    dateButtonText: {
        fontSize: 18,
        color: '#333',
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 50,
        elevation: 3,
        marginTop: 20,
        backgroundColor: 'black',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 40,
        width: '85%',
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
    titleF: {
        marginBottom: 25,
        marginTop: 20,
    },
    input1: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 3,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 18,
    },
});
