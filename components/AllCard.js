import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import Card from './Card';
import Button from './Button';
import { data } from '../data';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../features/api/apiSlice';
import {
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from '../features/cart/cartSlice';

const renderTabBar = (props) => (
  <TabBar
    {...props}
    bounces={true}
    inactiveColor={'grey'}
    activeColor={'green'}
    pressColor={'grey'}
    indicatorStyle={{ backgroundColor: 'green', height: 3 }}
    style={{ backgroundColor: 'white' }}
    labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
  />
);

const AllCard = () => {
  const navigation = useNavigation();
  const {
    data: products = [],
    isLoading: productsLoading,
    isFetching,
    error,
    fetch,
  } = useGetProductsQuery();

  const totalPrice = useSelector(selectCartTotalPrice);
  const totalQty = useSelector(selectCartTotalQuantity);

  // const [products, setProducts] = useState(data);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'Men', title: 'Men' },
    { key: 'Ladies', title: 'Ladies' },
    { key: 'Kids', title: 'Kids' },
    { key: 'Home', title: 'Home' },
  ]);

  // const allTotal = useSelector((state) => state.cart.total);
  // const totalQty = useSelector((state) => state.cart.totalQty);
  const renderItem = ({ item, index }) => {
    return <Card key={item.productId} product={item} />;
  };
  function CategoryList({ categoryName }) {
    const filteredData = products.filter(
      (item) => item.item_cat1 == categoryName
    );
    return (
      <View style={styles.container}>
        <FlatList
          data={filteredData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.cardList}
        />
        <Button
          title="Next"
          onPress={() => navigation.navigate('SelectService')}
        />
      </View>
    );
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'Men':
        return <CategoryList categoryName="Men" />;
      case 'Ladies':
        return <CategoryList categoryName="Ladies" />;
      case 'Kids':
        return <CategoryList categoryName="Kids" />;
      case 'Home':
        return <CategoryList categoryName="Home" />;
    }
  };
  return (
    <>
      <Text>total : {totalPrice}</Text>
      <Text>total quantity : {totalQty}</Text>

      <TabView
        // lazy={true}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 37,
    flex: 1,
    backgroundColor: Colors.Tertiary700,
  },
  cardList: {
    paddingBottom: 16,
  },
});

export default AllCard;
