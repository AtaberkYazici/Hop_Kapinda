import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SectionList, ScrollView, ActivityIndicator,ListRenderItem } from 'react-native';
import ParallexScrollView from '../components/ParallexScrollView';
import Colors from '../constants/Colors';
import { useNavigation, Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useBasketStore from './store/basketStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


const Details = () => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<TouchableOpacity[]>([]);
  const opacity = useSharedValue(0);

  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimatedViewVisible, setIsAnimatedViewVisible] = useState(false);
  const [isBasketVisible, setIsBasketVisible] = useState(false);
  const { items, total } = useBasketStore();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/restaurants/${id}`);
        const data = await response.json();
        if (data && data.img) {
          setRestaurantData(data);
          setIsAnimatedViewVisible(true);
        } else {
          setError(new Error("Restaurant data or image path not found"));
          setIsAnimatedViewVisible(false);
        }
      } catch (error) {
        setError(error);
        setIsAnimatedViewVisible(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();

    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundButtons}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [id, navigation]);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    selected.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
  };

  const renderItem: ListRenderItem<any> = ({ item, index }) =>(
    <Link href={{ pathname: '/dish', params: { id: item.id, restaurantId: id } }} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dish}>{item.name}</Text>
          <Text style={styles.dishText}>{item.info}</Text>
          <Text style={styles.dishText}>${item.price}</Text>
        </View>
        <Image source={{uri:item.img}} style={styles.dishImage} />
      </TouchableOpacity>
    </Link>
  );

  const handleBasketPress = () => {
    setIsBasketVisible(!isBasketVisible); 
  };

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const DATA = restaurantData.food.map((item, index) => ({
    title: item.category,
    data: item.meals,
    index,
  }));

  return (
    <>
      <ParallexScrollView backgroundColor={'#fff'} style={{flex:1}} parallaxHeaderHeight={250}  renderBackground={() => 
        <Image source= {{uri: restaurantData.img}} style={{ height: 300, width: '100%' }}/>
      } 
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          { <Text style={styles.restaurantDescription}>
            {restaurantData.delivery} · {restaurantData.tags.map((tag, index) => `${tag}${index < restaurantData.tags.length - 1 ? ' · ' : ''}`)}
          </Text> }
          <Text style={styles.restaurantDescription}>{restaurantData.about}</Text>
          <SectionList
            contentContainerStyle={{ paddingBottom: 50 }}
            keyExtractor={(item, index) => `${item.id + index}`}
            scrollEnabled={false}
            sections={DATA}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ marginHorizontal: 16, height: 1, backgroundColor: Colors.grey }} />}
            SectionSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.grey }} />}
            renderSectionHeader={({ section: { title, index } }) => <Text style={styles.sectionHeader}>{title}
            </Text>}
          />
        </View>
      </ParallexScrollView>
      {isAnimatedViewVisible&&(<Animated.View style={[styles.stickySegments, animatedStyles]}>
        <View style={styles.segmentsShadow}>
          <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentScrollview}>
            {restaurantData.food.map((item, index) => (
              <TouchableOpacity
                ref={(ref) => (itemsRef.current[index] = ref!)}
                key={index}
                style={activeIndex === index ? styles.segmentButtonActive : styles.segmentButton}
                onPress={() => selectCategory(index)}>
                <Text style={activeIndex === index ? styles.segmentTextActive : styles.segmentText}>{item.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </Animated.View>
     )}
      <TouchableOpacity onPress={handleBasketPress} style={styles.basketButton}>
        <Text>Show Basket</Text>
      </TouchableOpacity>
      {isBasketVisible &&  (
        <View style={styles.footer}>
          <SafeAreaView style={{ backgroundColor: '#fff' }} edges={['bottom']}>
            <Link href="/basket" asChild>
              <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.basket}>{items}</Text>
                <Text style={styles.footerText}>View Basket</Text>
                <Text style={styles.basketTotal}>${total}</Text>
              </TouchableOpacity>
            </Link>
          </SafeAreaView>
        </View>
      )} 
    </>
  );
}
const styles = StyleSheet.create({
  
  detailsContainer:{
    backgroundColor: Colors.lightGrey
  },
  stickySection:{
    backgroundColor:'#fff',
    marginLeft:70,
    height:100,
    justifyContent:"flex-end"
  },
  roundButtons:{
    width:40,
    height:40,
    borderRadius: 20,
    backgroundColor:'#fff',
    justifyContent:'center'
  },
  stickySectionText:{
    fontSize:20,
    margin:10
  },
  restaurantName:{
    fontSize: 30,
    margin: 16,
  },
  restaurantDescription:{
    fontSize: 16,
    margin: 16,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader:{
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    margin: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
  },
  dishImage: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  dish: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dishText: {
    fontSize: 14,
    color: Colors.medium,
    paddingVertical: 4,
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
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    height: 50,
  },
  basketButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 40,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  basket: {
    color: '#fff',
    backgroundColor: '#19AA86',
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 2,
  },
  basketTotal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stickySegments: {
    position: 'absolute',
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '100%',
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
export default Details


