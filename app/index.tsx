import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Categories from '../components/Categories'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/Colors'
import Restaurants from '../components/Restaurants'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Details from './details'

const Stack = createNativeStackNavigator();
const Page = () => {
  return (

    <SafeAreaView style = {styles.container}>
      <ScrollView>
        <Categories></Categories>
        <Text style = {styles.header}> Restorantlar </Text>
        <View style = {styles.restaurants}>
        <Restaurants selectedCategory={undefined}></Restaurants>
        <Stack.Screen name="Details" component={Details} />
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  container: {
    top:10,
    bottom : 30,
    backgroundColor : Colors.lightGrey,
    borderRadius : 40
  },
  header: {
    fontSize: 18,
    fontWeight : 'bold',
    marginBottom : 16,
    paddingHorizontal : 16
    },
    restaurants : {
      margin:20
    }
})
export default Page