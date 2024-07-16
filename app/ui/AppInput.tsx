import colors from '@/utils/colors';
import React,{FC} from 'react';
import {TextInputProps, StyleSheet, TextInput} from 'react-native';

interface Props extends TextInputProps {}

const AppInput: FC<Props> = props => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.OVERLAY}
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.DARK,
    height: 45,
    borderRadius: 25,
    color: colors.DARK,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: "#ffffffc2"
  },
});

export default AppInput;
