import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { StyleSheet, View, Alert, Pressable, Text,SafeAreaView } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'

export default function Account({ session }: { session: Session }) {
  
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return (

    <SafeAreaView className="flex-1 items-center justify-center bg-white p-5">
      <View>
        <View className='flex items-center justify-center'>
            <Avatar
              size={200}
              url={avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url })
              }}
            />
          </View>
      </View>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>

        <Input 
          className="ml-1 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        label="Email" 
        value={session?.user?.email} disabled />
      </View>

      <View style={styles.verticallySpaced}>
        <Input 
          className="ml-1 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          selectionColor={'black'}
          label="Username" 
          value={username || ''} 
          onChangeText={(text) => setUsername(text)} />
      </View>

      <View style={styles.verticallySpaced}>
        <Input 
          className="ml-1 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          selectionColor={'black'}
          label="Boleta" 
          value={website || ''} 
          onChangeText={(text) => setWebsite(text)} />
      </View>

          <View className='mt-20' style={styles.verticallySpaced}>
                <Pressable 
                  disabled={loading} 
                  style={styles.button} 
                  onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })} >
                  <Text style={styles.text}> {loading ? 'Loading ...' : 'Update'} </Text>
                  
                </Pressable>
          </View>

          <View className='mt-7' style={styles.verticallySpaced}>
                <Pressable 
                  style={styles.button} 
                  onPress={() => supabase.auth.signOut()}>
                  <Text style={styles.text}> Sign Out </Text>
                </Pressable>
          </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  imagen: {
    borderRadius: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
})