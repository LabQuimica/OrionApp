import { NavigationContainer } from "@react-navigation/native"
import HomeScreen from "./src/presentation/screens/HomeScreen"
import { HomeNavigator } from "./src/presentation/navigator/HomeNavigator"

const Navigation = () => {
  return (
    <NavigationContainer>
        <HomeNavigator />
    </NavigationContainer>
  )
}

export default Navigation