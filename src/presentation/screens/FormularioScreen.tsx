import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { StyleSheet, TextInput, View, Text, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import DatePike from 'react-native-modern-datepicker';
import { format } from 'date-fns';
import { Session } from '@supabase/supabase-js'

export default function FormularioScreen({ session }: { session: Session }) {
    const [openStartDatePicker, setOpenStartDatePiker] = useState(false);
    const [minStartDate, setMinStartDate] = useState(new Date());
    /*const today = new Date();
    const startDate = today.setDate(today.getDate()+1 );*/
    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        setMinStartDate(today);
    }, []);


    const [selectedStartDate, setSelectedStartDate] = useState("");

    const handleOnPressStartDate = () => {
        setOpenStartDatePiker(!openStartDatePicker);
    }

    const { control, handleSubmit, setValue } = useForm();
    const [selectedPractice, setSelectedPractice] = useState('');
    const [profilesData, setProfilesDate] = useState<any[]>([]);

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')

    const options={
        mainColor: "#469ab6",
        borderColor: 'rgba(122,146,165,0.1)'
        
    }

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                console.log(data.username)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data1) => {
        // Verificar si todos los campos requeridos están llenos
        const requiredFields = ['id_usuario', 'id_practica', 'grupo', 'ua', 'fecha']; // Asegúrate de incluir aquí todos los campos requeridos
        const areFieldsFilled = requiredFields.every(field => data1[field] && data1[field].trim() !== '');
    
        if (!areFieldsFilled) {
            Alert.alert("Error", "Por favor, completa todos los campos antes de confirmar.");
            return;
        }
    
        try {
            const { data, error } = await supabase
                .from("vales")
                .insert([data1]);
            if (error) {
                throw error;
            }
            console.log("Data inserted:", data);
            // Aquí puedes llamar a la función para recargar los datos del calendario
            // Por ejemplo: reloadCalendarData();
        } catch (error) {
            console.error("Error inserting data:", error.message);
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
                    name="id_usuario"
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
    titleF :{
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