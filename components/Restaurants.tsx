import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Link } from 'expo-router'



const Restaurants = ({selectedCategory}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
    const filteredRestaurants = selectedCategory
  ? restaurants.filter(restaurant => restaurant.tags.includes(selectedCategory.text))
  : restaurants;

  return (
    <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 15, margin: 5 }}>
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant, index) => (
          <Link key={restaurant.id} href={{ pathname: '/details', params: { id: restaurant.id } }} asChild>
            <TouchableOpacity onPress={() => console.log(index)}>
              <View style={styles.categoryCard}>
                <Image source={{uri: restaurant.img}} style={styles.image} />
                <View style={styles.categoryBox}>
                  <Text style={styles.categoryText}>{restaurant.name}</Text>
                  <Text style={styles.categoryText}>
                    {restaurant.rating} {restaurant.ratings}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))
      ) : (
        <Text>No restaurants found</Text>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    categoryCard: {
        width : 300,
        height : 250,
        backgroundColor: 'white',
        marginEnd:10,
        padding : 10,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4
        },
        borderRadius: 30,
        shadowOpacity: 0.06,
        overflow:'hidden'
    },
    categoryText : {
        padding : 5,
        fontSize:12,
        marginLeft: 40,
        fontWeight : 'bold'
    },
    image: {
        flex: 1, 
        width: 200, 
        height: 200,
        padding: 10,
        marginLeft: 40,
        overflow: 'hidden',
        borderRadius : 10
    },
    categoryBox:{
        flex:1
    }
})


export default Restaurants