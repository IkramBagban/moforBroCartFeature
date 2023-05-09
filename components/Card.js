import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import Toast from 'react-native-toast-message';
import { Colors } from '../constants/colors';


import {
  addToCart,
  removeFromCart,
  clearCart,
  selectAllCartItems,
  selectCartItemById,
  selectItemTotalPrice,
  selectCartTotalPrice,
  updateCartItemQuantity,
  updateItemServiceType,
  updateItemDelivery,
} from '../redux/cartSlice';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const Card = ({ product }) => {
  const cartItem = useSelector((state) =>
    selectCartItemById(state, product.id)
  );

  const allProduct = useSelector(state=>state.cart.products)

  // const [cartItem, setCartItem] = useState(item);

  const cartItemPrice = useSelector((state) =>
    selectItemTotalPrice(state, product.id)
  );

  const allCartItems = useSelector(selectAllCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState(
    cartItem ? cartItem.service : { type: undefined, price: 0 }
  );
  const [selectedDelivery, setSelectedDelivery] = useState(
    cartItem ? cartItem.delivery : { type: undefined}
  );

  const isDisabled = !Boolean(cartItem?.quantity > 0);
  // const hasServiceAndDelivery = Boolean(selectedService && selectedDelivery);

  const dispatch = useDispatch();
  const delivery = [
    { title: 'Folder' },
    { title: 'Hanger' },
  ];

  let deliveryType = '1';
  const filtered = useMemo(() => {
    return product.pricing
      ?.filter(
        (obj) => obj.deliveryType == deliveryType && obj.emirate_id === '3'
      )
      .map(({ service, price }) => ({ service, price }));
  }, [product]);

  

  function decreaseQtyHandler() {
    if (selectedService) {
      cartItem
        ? cartItem.quantity === 1
          ? dispatch(removeFromCart(cartItem.id))
          : dispatch(
              updateCartItemQuantity({
                id: cartItem.id,
                quantity: cartItem.quantity - 1,
              })
            )
        : {};
    } else Alert.alert('please Select Any Serivce');
  }

  function increaseQtyHandler() {
    if (!selectedService.type || !selectedDelivery.type) return

    if (selectedService) {
      cartItem
        ? dispatch(
            updateCartItemQuantity({
              id: cartItem?.id,
              quantity: cartItem.quantity + 1,
            })
          )
        : (dispatch(
            addToCart({
              cartItem:product,
              service: selectedService,
              delivery: selectedDelivery,
              id: product.id,
              name: product.item_name,
              quantity: 1,
              category: product.item_cat1,
              deliveryType
            })
          )
          );
    } else
      Platform.OS == 'web'
        ? alert('Select a service')
        : Alert.alert('please Select Any Serivce');
  }

  function serviceButtonHandler(service) {
    const s = {
      type: service.service,
      price: Number(parseFloat(service.price).toFixed(2)) ?? 1,
    };
    setSelectedService(s);
    // console.log(selectedService);
    cartItem &&
      dispatch(
        updateItemServiceType({
          id: product.id,
          serviceType: s.type,
          servicePrice: s.price,
          deliveryType
        })
      );

      console.log('allProduct',allProduct)
  }

  function deliveryButtonHandler(delivery) {
    // console.log(delivery); 
    const d = {
      type: delivery.title,
    };
    setSelectedDelivery(d);
    // console.log(selectedDelivery);
    cartItem &&
      dispatch(
        updateItemDelivery({
          id: product.id,
          deliveryType: d.type,
        })
      );
  }

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.productName}>{product.item_name}</Text>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/favicon.png')} style={styles.image} />
        <View style={styles.quantityContainer}>
          <Button
            title="+"
            onPress={increaseQtyHandler}
            style={styles.quantityButton}
            color={Colors.Primary500}
          />
          <Text style={styles.quantityText}>{cartItem?.quantity ?? 0}</Text>
          <Button
            title="-"
            onPress={decreaseQtyHandler}
            style={[styles.quantityButton, isDisabled && styles.disabledButton]}
            color={Colors.Primary500}
            disabled={isDisabled}
          />
        </View>
      </View>
      <View style={styles.serviceContainer}>
        <Text style={styles.serviceText}>Service</Text>
        <FlatList
          data={filtered}
          keyExtractor={(_, idx) => idx}
          renderItem={(item) => {
            return (
              <>
                <Button
                  // key={item.index}
                  title={item.item.service}
                  style={[
                    styles.serviceButton,
                    selectedService.type == item.item.service
                      ? styles.selectedButton
                      : {},
                  ]}
                  onPress={() => serviceButtonHandler(item.item)}
                  color={
                    selectedService.type == item.item.service
                      ? 'white'
                      : 'black'
                  }
                />
              </>
            );
          }}
          horizontal={true}
        />
      </View>
      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryText}>Delivery</Text>
        <FlatList
          data={delivery}
          keyExtractor={(item) => item.title}
          renderItem={(item, idx) => (
            <Button
              key={idx}
              title={item.item.title}
              style={[
                styles.deliveryButton,
                selectedDelivery.type == item.item.title
                  ? styles.selectedButton
                  : {},
              ]}
              onPress={() => deliveryButtonHandler(item.item)}
              color={
                selectedDelivery.type == item.item.title ? 'white' : 'black'
              }
            />
          )}
          horizontal={true}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={[styles.totalText, { color: Colors.Primary600 }]}>
          AED {cartItemPrice}
        </Text>
        <Text style={[styles.totalText, { color: Colors.Primary600 }]}>
          {cartItem?.quantity ?? 0}
        </Text>
        <Text style={[styles.totalText, { color: Colors.Primary600 }]}>
          {/* qty : {quantity}, total : {allTheTotal}{" "} */}
        </Text>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignproducts: 'stretch',
    padding: 10,
    backgroundColor: Colors.Tertiary700,
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 4,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.Tertiary50,
    // alignproducts:'center',
    // justifyContent:'center'
  },
  imageContainer: {
    flexDirection: 'row',
    alignproducts: 'center',
    justifyContent: 'space-between',
    width: width * 0.9,
    height: height * 0.2,
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignproducts: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: width * 0.08,
    height: height * 0.05,
  },
  quantityText: {
    marginHorizontal: width * 0.02,
    color: Colors.Tertiary50,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignproducts: 'center',
    justifyContent: 'space-around',
    width: width * 0.9,
    height: height * 0.1,
  },
  serviceText: {
    fontWeight: 'bold',
    color: Colors.Tertiary50,
    marginLeft: 10,
  },
  serviceButton: {
    width: width * 0.2,
    height: height * 0.05,
    marginHorizontal: 10,
    //  padv
  },
  selectedButton: {
    backgroundColor: Colors.primary500,
    color: 'white',
  },
  disabledButton: {
    opacity: '0.3',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignproducts: 'center',
    justifyContent: 'space-around',
    width: width * 0.9,
    height: height * 0.1,
  },
  deliveryText: {
    fontWeight: 'bold',
    color: Colors.Tertiary50,
  },
  deliveryButton: {
    width: width * 0.2,
    height: height * 0.05,
    marginHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    alignproducts: 'center',
    justifyContent: 'space-around',
    width: width * 0.9,
    height: height * 0.1,
  },
  totalText: {
    fontWeight: 'bold',
  },
});

export default Card;
