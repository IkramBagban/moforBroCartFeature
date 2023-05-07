import {View, Text, StyleSheet} from 'react-native';
import { ColorPalate } from '../constants/colors';

const Title = ({text, size = 25}) => {
  return <Text style={[styles.textStyle, {fontSize : size}]}>{text}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 40,
    color: ColorPalate.themeprimary,
  },
});
