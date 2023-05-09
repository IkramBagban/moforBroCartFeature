import {
  View,
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Button from '../components/Button';
import { Colors } from '../constants/colors';
import { reviewData } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { getTotal, updateDeliveryType } from '../redux/cartSlice';
import { TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { selectCartTotalPrice } from '../redux/cartSlice';

const SelectService = ({ navigation }) => {
  const [dates, setDates] = useState({
    pickupDate: new Date(),
    deliveryDate: new Date(),
  });

  const [selectedButton, setSelectedButton] = useState('1');

  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);
  const totalPrice = useSelector(selectCartTotalPrice);
  useEffect(() => {
    // products.map((product, index) => {
    //   dispatch(
    //     getTotal({
    //       itemID: product.itemID,
    //       service: items[index].service,
    //       deliveryType: selectedButton,
    //     })
    //   );
    // });
    dispatch(updateDeliveryType(selectedButton))
    console.log('selectedType', selectedButton);
  }, [selectedButton]);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState('');
  const [notes, setNotes] = useState('');

  // const total = useSelector((state) => state.cart.total);

  const handlePickerOpen = (type) => {
    setShowPicker(true);
    setPickerType(type);
    console.log('dates', dates);
  };

  const handlePickerClose = () => {
    setShowPicker(false);
  };

  const handleDateChange = (e, selectedDate) => {
    const currentDate = selectedDate || dates[pickerType];
    setDates({ ...dates, [pickerType]: currentDate });
    handlePickerClose();
    console.log('lastdates', dates);
  };

  const onNotesChange = (text) => {
    setNotes(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reviewData}
        key={({ item }) => item.deliveryType}
        renderItem={({ item, index }) => (
          <Button
            title={item.c_delivery_type}
            style={[
              styles.button,
              selectedButton === item.c_deliveryTypeID && styles.selectedButton,
            ]}
            color={
              selectedButton === item.c_deliveryTypeID ? 'white' : undefined
            }
            onPress={() => {
              setSelectedButton(item.c_deliveryTypeID);
              // console.log('selected button,',selectedButton)
            }}
          />
        )}
        horizontal={true}
      />
      <Text style={styles.label}>Pick-up Date</Text>
      <TouchableOpacity onPress={() => handlePickerOpen('pickupDate')}>
        <View style={styles.input}>
          <Text style={styles.inputText}>
            {dates.pickupDate.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Delivery Date</Text>
      <TouchableOpacity onPress={() => handlePickerOpen('deliveryDate')}>
        <View style={styles.input}>
          <Text style={styles.inputText}>
            {dates.deliveryDate.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          value={dates[pickerType]}
          is24Hour={false}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Add special request</Text>
      <View style={styles.input}>
        <TextInput
          style={[styles.inputText, { textAlignVertical: 'top' }]}
          multiline
          numberOfLines={4}
          onChangeText={onNotesChange}
          value={notes}
        />
      </View>
      <Text>total {totalPrice}</Text>
      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('ReviewOrder', {
            dates: dates,
            notes: notes,
          })
        }
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#3b9fdc',
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#89919cff',
    padding: 10,
    borderRadius: 5,
  },
  inputText: {
    fontSize: 14,
    color: '#B2C6E8',
  },
  button: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.primary500,
    color: 'white',
  },
  card: {
    flexDirection: 'row',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImg: {
    width: 100,
    height: 100,
  },
  cardBody: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
  },
});
export default SelectService;
