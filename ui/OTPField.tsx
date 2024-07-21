import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import colors from '@/utils/colors';

interface Props extends TextInputProps {
    ref: any
}

const OTPField = forwardRef<TextInput, Props>((props, ref) => {
    return (
        <TextInput
            {...props}
            ref={ref}
            style={[styles.input, props.style]}
            placeholderTextColor={colors.INACTIVE_CONTRAST}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderWidth: 3,
        textAlign: "center",
        color: colors.DARK,
        fontWeight:700,
        borderColor: colors.SECONDARY
    }
});

export default OTPField;