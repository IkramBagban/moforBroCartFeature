import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { ColorPalate, Colors } from '../constants/colors';
import Button from '../components/Button';
import { reviewData } from '../data';
import {
  getTotal,
  removeItem,
  removeOthers,
  updateOthers,
} from '../redux/cartSlice';
import Title from '../components/Title';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import {
  removeFromCart,
  selectAllCartItems,
  selectCartItemById,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  selectItemTotalPrice,
  updateCartItemQuantity,
} from '../redux/cartSlice';

const ReviewOrder = ({ route }) => {
  const filteredCart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // -----------------------
  const dates = route.params.dates;
  const pickupDateString = dates.pickupDate.toISOString().substring(0, 10);
  const deliveryDateString = dates.deliveryDate.toISOString().substring(0, 10);
  const notes = route.params.notes;

  // -----------------------

  const cartItems = useSelector(selectAllCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalQty = useSelector(selectCartTotalQuantity);

  const handleDeleteItem = (itemID) => {
    dispatch(removeFromCart(itemID));
  };

  const handleUpdateQuantity = (item, action) => {
    if (
      item &&
      (action === 'increase' || (action === 'decrease' && item.quantity > 0))
    ) {
      item.quantity === 1 && action === 'decrease'
        ? dispatch(removeFromCart(item.id))
        : dispatch(
            updateCartItemQuantity({
              id: item.id,
              quantity:
                action === 'increase' ? item.quantity + 1 : item.quantity - 1,
            })
          );
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={{ flex: 2 }}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Button
            title="-"
            onPress={() => handleUpdateQuantity(item, 'decrease')}
          />
          <Text style={styles.itemName}> {item.quantity}</Text>
          <Button
            title="+"
            onPress={() => handleUpdateQuantity(item, 'increase')}
          />
          <Text style={styles.itemName}>
            {' '}
            {Number(parseFloat(item.quantity * item.service.price).toFixed(2))}
          </Text>
        </View>
        <Button title="delete" onPress={() => handleDeleteItem(item.id)} />
      </View>
    );
  };

  return (
    <View>
      <Title text="Cart List Item here"></Title>
      <View>
        <Text style={styles.dateText}>
          mode : {'(deleveryType) standard/express/same day'}{' '}
        </Text>
        <Text style={styles.dateText}>pickup date : {pickupDateString} </Text>
        <Text style={styles.dateText}>
          delivery date : {deliveryDateString}{' '}
        </Text>
        <Text style={styles.specialRequestText}>special request : {notes}</Text>
      </View>
      <ScrollView>
        <FlatList
          data={cartItems}
          keyExtractor={(item, idx) => idx}
          renderItem={renderItem}
        />
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ textAlign: 'right', color: ColorPalate.dgrey }}>
          Total amount : {totalPrice} | Total Quantity : {totalQty}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <TouchableOpacity>
          <Text style={styles.totalText}>Order </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    marginVertical: 5,
    padding: 20,
    backgroundColor: ColorPalate.white,
    borderRadius: 5,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: ColorPalate.themeprimary,
    marginBottom: 5,
  },
  specialRequestText: {
    fontSize: 16,
    color: ColorPalate.themeprimary,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemName: {
    textTransform: 'capitalize',
    fontSize: 14,
    color: ColorPalate.themeprimary,
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  totalText: {
    color: ColorPalate.white,
    fontSize: 18,
  },
});

export default ReviewOrder;
