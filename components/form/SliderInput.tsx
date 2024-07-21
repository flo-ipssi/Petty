import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from '@react-native-community/slider';
interface Props { }

const SliderInput: FC<Props> = ({ }) => {
    const [
        nonCollidingMultiSliderValue,
        setNonCollidingMultiSliderValue,
    ] = React.useState([0, 100]);

    return (
        <View>
            <View style={styles.sliderOne}>
                <Text style={styles.text}>
                    Two Markers with minimum overlap distance:
                </Text>
                <Text style={styles.text}>{nonCollidingMultiSliderValue[0]} </Text>
                <Text style={styles.text}>{nonCollidingMultiSliderValue[1]}</Text>
            </View>
            <Slider
                // onValuesChange={(values: React.SetStateAction<number[]>) => setNonCollidingMultiSliderValue(values)}
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value={0}
            />
        </View>
    );

};
const styles = StyleSheet.create({
    sliderOne: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    text: {
        alignSelf: "center",
        paddingVertical: 20,
    },
    container: {},
});
export default SliderInput;
