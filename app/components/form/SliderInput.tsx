import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
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
            <MultiSlider
                values={[
                    nonCollidingMultiSliderValue[0],
                    nonCollidingMultiSliderValue[1],
                ]}
                sliderLength={280}
                onValuesChange={(values: React.SetStateAction<number[]>) => setNonCollidingMultiSliderValue(values)}
                min={0}
                max={100}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={40}
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
