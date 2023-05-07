import { View,StyleSheet } from 'react-native'
import React from 'react'
import { Provider} from 'react-redux'
import { store } from './redux/store'
import AllCard from './components/AllCard'
import { Colors } from './constants/colors';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SelectService from './screen/SelectService'
import ReviewOrder from './screen/ReviewOrder'
const Stack = createStackNavigator()

const App = () => {
  return (
      <View style={styles.container}>
       <AllCard />
      </View>
  )
}
export default function () {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='App' component={App} />
          <Stack.Screen name='SelectService' component={SelectService} />
          <Stack.Screen name='ReviewOrder' component={ReviewOrder} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Tertiary100,
    // padding: 16,
  },
});
