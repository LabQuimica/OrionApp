import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const PracticasScreen = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
    <Image source={require('../../../assets/imagenP.jpg')} style={{height:300}}/>

    </SafeAreaView>
  )
}

export default PracticasScreen