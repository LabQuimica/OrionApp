import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase'; 
import { StyleSheet, TextInput, Button, View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import DatePike from 'react-native-modern-datepicker';
import { format } from 'date-fns';

export default function FormularioScreen() {
    const [openStartDatePicker, setOpenStartDatePiker] = useState(false);
    const today = new Date();
    const startDate = format(today.setDate(today.getDate() + 1), 'yyyy-MM-dd');

    const [selectedStartDate, setSelectedStartDate] = useState("");

    const handleOnPressStartDate = () => {
        setOpenStartDatePiker(!openStartDatePicker);
    }

    const { control, handleSubmit, setValue } = useForm();
    const [selectedPractice, setSelectedPractice] = useState('');

    /*const onSubmit = async(data1) => {
        const{data,error} = await supabase.from("vales").insert({data1});
        if(error){
            console.log(error);
        }
        console.log(data1);
    };*/
    const onSubmit = async (data1) => {
        try {
            // Inserción de datos en la tabla 'vales'
            const { data, error } = await supabase
                .from("vales")
                .insert([data1]); // Asegúrate de enviar `data1` dentro de un array
    
            if (error) {
                throw error; // Lanza el error para que sea capturado por el bloque catch
            }
    
            console.log("Data inserted:", data); // Imprime los datos insertados
        } catch (error) {
            console.error("Error inserting data:", error.message); // Maneja y muestra el error
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.label}>Nombre del docente:</Text>
                <Controller
                    control={control}
                    name="id_usuario"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Text style={styles.label}>Nombre de la práctica:</Text>
                <Controller
                    control={control}
                    name="id_practica"
                    render={({ field: { onChange, value } }) => (
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                                onChange(itemValue);
                                setSelectedPractice(itemValue);
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione una opción" value="" />
                            <Picker.Item label="Practica prueba" value="1" />
                            <Picker.Item label="Realizar juegos de colores" value="2" />
                            <Picker.Item label="Decantación" value="3" />
                            <Picker.Item label="Microbilogía" value="4" />
                        </Picker>
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

                <Text style={styles.label}>UA:</Text>
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
                                        <DatePike
                                            mode="calendar"
                                            minimumDate={startDate}
                                            selected={selectedStartDate}
                                            onDateChange={(date) => {
                                                setSelectedStartDate(date);
                                                setValue("fecha", format(date, 'yyyy-MM-dd'));  // Actualiza el valor en react-hook-form
                                            }}
                                            options={{
                                                backgroundColor: "#080516",
                                                textHeaderColor: "#469ab6",
                                                textDefaultColor: '#ffffff',
                                                selectedTextColor: '#fff',
                                                mainColor: "#469ab6",
                                                textSecondaryColor: "#ffffff",
                                                borderColor: 'rgba(122,146,165,0.1)'
                                            }}
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
        backgroundColor: 'white',
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    dateButton: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#469ab6',
        borderRadius: 8,
        marginBottom: 20,
    },
    dateButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#469ab6',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    submitButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28a745',
        borderRadius: 8,
        marginBottom: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
