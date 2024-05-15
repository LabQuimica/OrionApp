import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import  Ionicons  from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

const HomeScreen = () => {

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const fetchData = async () => {
      const { data, error} = await supabase.from('kits').select('*')
      if (error) {
        console.log('error', error)
      } else {
        setData(data)
      }
    }

    fetchData()
  }, [])

  console.log(JSON.stringify(data))

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
    <Ionicons name="airplane-outline" color={'white'} size={30} />
    <Text className='text-white'>{JSON.stringify(data)}</Text>
  </SafeAreaView>
  )
}

export default HomeScreen