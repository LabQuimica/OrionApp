import React, { useState } from 'react'
import {Text, Alert, StyleSheet, View, AppState, Image, TouchableOpacity, Pressable} from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Input } from 'react-native-elements'
import Ionicons from '@expo/vector-icons/Ionicons'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8' >

    <View className="flex items-center justify-center"> 
      <Image source={require('../../../assets/logo.png')} style={{ height: 300, width: 300  }} />
    </View>
    <View className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" >
          <View>
            <Input
            className="ml-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              label="Email"
              leftIcon={<Ionicons name="mail" color={'#00376b'} size={30} />}
              onChangeText={(text) => setEmail(text)}
              value={email}
              selectionColor={'black'}
              placeholder="email@address.com"
              autoCapitalize={'none'}
            />
          </View>
          <View>
          <Input
            className="ml-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="contraseña"
            selectionColor={'black'}
            label="Contraseña"
            leftIcon={<Ionicons name="key" color={'#00376b'} size={30} />}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            autoCapitalize={'none'}
          />
            {/* <Ionicons name="airplane-outline" color={'black'} size={30} /> */}
          </View>
          <View>
            <Pressable style={styles.button} onPress={() => signInWithEmail()}>
              <Text style={styles.text}>Ingresar </Text>
            </Pressable>
          </View>


          <View className='mt-10'>
            <Pressable disabled={loading} style={styles.button} onPress={() => signUpWithEmail()}>
              <Text style={styles.text}> Registrame </Text>
            </Pressable>
          </View>

    </View>

    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: '#00376b',
    marginBottom : 10,
    margin : 10
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});