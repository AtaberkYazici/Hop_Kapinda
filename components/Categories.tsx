import { View, Text, StyleSheet, Image, TouchableOpacity,ActivityIndicator } from 'react-native'
import React, { useState, useEffect }  from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Restaurants from './Restaurants'

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  
    const handleCategoryPress = (category) => {
      setSelectedCategory(category);
      console.log(category.img);
    };
  
    return (
      <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
        {categories.map((category, index) => (
          <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category)}>
            <View style={styles.categoryCard}>
            <Image style={styles.categoryImage} source={{ uri: category.img }} />
              <Text style={styles.categoryText}>{category.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Restaurants selectedCategory={selectedCategory} />

      </>
    );
  };
const styles = StyleSheet.create({
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    marginEnd: 10,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    borderRadius: 30,
    shadowOpacity: 0.06,
    overflow: 'hidden'
  },
  categoryImage: {
    height: 70,
    width: 70,
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  categoryText: {
    padding: 5,
    fontSize: 12,
    marginLeft: 5,
    fontWeight: 'bold'
  }
});



export default Categories