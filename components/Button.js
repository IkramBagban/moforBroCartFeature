import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

const Button = ({ title, onPress, color, style, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.text, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 5,
    borderColor: Colors.Primary600,
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Export the custom button component
export default Button;
