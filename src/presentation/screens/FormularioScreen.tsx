import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar } from 'react-native-calendars';

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FormularioScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text>FormularioScreen</Text>
            </View>
        </SafeAreaView>

    )
}

export default FormularioScreen

const styles = StyleSheet.create({})