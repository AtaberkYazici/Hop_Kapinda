
import { Stack, useNavigation } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayoutNav() {
  const navigation = useNavigation();
  return (
      <Stack>
        <Stack.Screen name="index" options={{
          header : ()=> <CustomHeader></CustomHeader>
        }} />
        <Stack.Screen
          name="dish"
          options={{
            presentation: 'modal',
            headerTitle: '',
            headerTransparent: true,

            headerLeft: () => (
              <TouchableOpacity
                style={{ backgroundColor: '#fff', borderRadius: 20, padding: 6 }}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons name="close-outline" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
         <Stack.Screen
          name="basket"
          options={{
            headerTitle: 'Basket',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons name="arrow-back" size={28} color={Colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        
      </Stack>
      

  );
}
