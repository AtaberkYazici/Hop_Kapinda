import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import useBasketStore from '../app/store/basketStore';

const Dish = () => {
  const { id: dishId, restaurantId } = useLocalSearchParams();
  const [dish, setDish] = useState(null);
  const router = useRouter();
  const { addProduct } = useBasketStore();

  
  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`http:/localhost:3000/api/restaurants/${restaurantId}/dishes/${dishId}`);
        const data = await response.json();
        setDish(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDish();
  }, [dishId, restaurantId]);

  const addToCart = () => {
    addProduct(dish);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };
  if (!dish || !dish.img) {
    return null; // You can render a loading indicator here if needed
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <View style={styles.container}>
        <Animated.Image entering={FadeIn.duration(400).delay(200)} source={{uri: dish?.img}} style={styles.image} />
        <View style={{ padding: 20 }}>
          <Animated.Text entering={FadeInLeft.duration(400).delay(200)} style={styles.dishName}>
            {dish?.name}
          </Animated.Text>
          <Animated.Text entering={FadeInLeft.duration(400).delay(400)} style={styles.dishInfo}>
            {dish?.info}
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.fullButton} onPress={addToCart}>
            <Text style={styles.footerText}>Add for ${dish?.price}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dishInfo: {
    fontSize: 16,
    color: Colors.medium,
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Dish;
