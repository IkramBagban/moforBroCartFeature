import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { Colors } from "../constants/colors";
import {
  addToCart,
  getTotal,
  removeItem,
  updateOthers,
} from "../redux/cartSlice";

const { width, height } = Dimensions.get("window");
const Card = ({ product }) => {
  const [total, setTotal] = useState(0);

  const [selectedButton, setSelectedButton] = useState('');
  const [serviceItem, setServiceItem] = useState('');

  const [selectDelivery, setSelectDelivery] = useState('');
  const [deliveryItem, selectDeliveryItem] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const delivery = [
    {title: 'Folder', price: 6},
    {title: 'Hanger', price: 20},
  ];

  let deliveryType = '1';
  let filtered = product.pricing?.filter(
    obj => obj.deliveryType == deliveryType && obj.emirate_id === '3',
  );

  let others = useSelector(state => state.cart.others);
  let idx = others.findIndex(i => i.itemID === product.itemID);
  let qty = others[idx]?.qty;
  let cartTotal = others[idx]?.total;
  // let selectedBtn = others[idx]?.selectedButton;
  useEffect(() => {
    setQuantity(qty || 0);
    setTotal(cartTotal || 0);
    // setSelectedButton(selectedBtn || '')
    // console.log('selected button', selectedButton);
  }, []);


  useEffect(() => {
    if (selectedButton) {
      quantity > 0 && dispatch(addToCart({product: product}));
      quantity == 0 && dispatch(removeItem({itemID: product.itemID}));
      dispatch(
        updateOthers({
          others: {
            qty: quantity ?? 0,
            total,
            itemID: product.itemID,
            deliveryPrice: deliveryPrice,
            selectDelivery: selectDelivery,
            selectedButton: selectedButton,
          },
        }),
      );
      
      serviceButtonHandler(serviceItem);
      dispatch(
        getTotal({
          itemID: product.itemID,
          service: serviceItem.item.service,
          deliveryType: deliveryType,
        }),
      );
    }
  }, [quantity, serviceItem, selectedButton, deliveryType]);

  function decreaseHandler() {
    if (selectedButton) {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    } else Alert.alert('please Select Any Serivce');
  }

  function increaseHandler() {
    if (selectedButton) setQuantity(quantity + 1);
    else Alert.alert('please Select Any Serivce');
  }

  function serviceButtonHandler(item) {
    setServiceItem(item);
    setTotal(quantity * item.item.price);
    setSelectedButton(item.item.service);
  }
function deliveryButtonHandler(item) {
  // console.log(item);
  selectDeliveryItem(item);
  setSelectDelivery(item.item.title);
  setDeliveryPrice(item.item.price);

}

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.productName}>{product.item_name}</Text>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/favicon.png")} style={styles.image} />
        <View style={styles.quantityContainer}>
          <Button
            title="+"
            onPress={increaseHandler}
            style={styles.quantityButton}
            color={Colors.Primary500}
          />
          <Text style={styles.quantityText}>{quantity}</Text>
          <Button
            title="-"
            onPress={decreaseHandler}
            style={styles.quantityButton}
            color={Colors.Primary500}
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
                  key={item.index}
                  title={item.item.service}
                  style={[
                    styles.serviceButton,
                    selectedButton == item.item.service &&
                      styles.selectedButton,
                  ]}
                  onPress={() => {
                    serviceButtonHandler(item);
                  }}
                  color={
                    selectedButton == item.item.service ? "white" : "black"
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
          renderItem={(item , idx) => (
            <Button
              key={idx}
              title={item.item.title}
              style={[
                styles.deliveryButton,
                selectDelivery == item.item.title && styles.selectedButton,
              ]}
                
              onPress={() => {
                deliveryButtonHandler(item)
              }}
            />
          )}
          horizontal={true}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={[styles.totalText, { color: Colors.Primary600 }]}>
          AED {product.price}
        </Text>
        <Text style={[styles.totalText, { color: Colors.Primary600 }]}>
          {total.toFixed(2)}{" "}
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
    flexDirection: "column",
    justifyContent: "flex-start",
    alignproducts: "stretch",
    padding: 10,
    backgroundColor: Colors.Tertiary700,
    borderRadius: 4,
    overflow: "hidden",
    elevation: 4,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.Tertiary50,
    // alignproducts:'center',
    // justifyContent:'center'
  },
  imageContainer: {
    flexDirection: "row",
    alignproducts: "center",
    justifyContent: "space-between",
    width: width * 0.9,
    height: height * 0.2,
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: "contain",
  },
  quantityContainer: {
    flexDirection: "row",
    alignproducts: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    alignproducts: "center",
    justifyContent: "space-around",
    width: width * 0.9,
    height: height * 0.1,
  },
  serviceText: {
    fontWeight: "bold",
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
    color: "white",
  },
  deliveryContainer: {
    flexDirection: "row",
    alignproducts: "center",
    justifyContent: "space-around",
    width: width * 0.9,
    height: height * 0.1,
  },
  deliveryText: {
    fontWeight: "bold",
    color: Colors.Tertiary50,
  },
  deliveryButton: {
    width: width * 0.2,
    height: height * 0.05,
    marginHorizontal: 10,
  },
  totalContainer: {
    flexDirection: "row",
    alignproducts: "center",
    justifyContent: "space-around",
    width: width * 0.9,
    height: height * 0.1,
  },
  totalText: {
    fontWeight: "bold",
  },
});

export default Card;
