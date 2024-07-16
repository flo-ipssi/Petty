import { FC } from "react";
import {
    StyleSheet,
    View,
    Animated,
    Text,
    Image,
    Dimensions,
    ImageSourcePropType,
    Pressable,
    TouchableOpacity,
} from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "../utils/fonts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PassewordVisibilityIcon from "./PassewordVisibilityIcon";
import React from "react";

interface Props {
    position?: Animated.ValueXY;
    onPress?(): void;
    infos?: any;
}


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const CardSwipe: FC<Props> = ({ position, onPress, infos }) => {
    const likeOpacity = position?.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: "clamp",
    });

    const dislikeOpacity = position?.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: "clamp",
    });

    const profil = infos.uploads
        .filter((upload: { profil: any }) => upload.profil)
        .map((upload: { file: { url: any } }) => upload.file.url)[0];

    const getTruncatedText = (text: string) => {
        return text.length < 10 ? text : `${text.substring(0, 10)}...`;
    };

    return (
        <View style={styles.imageContainer} data-attri={infos._id}>
            <View style={styles.imageWrapper}>
                
                <Image source={{ uri: profil }} style={styles.imageBackground}  />
                {position ? (
                    <>
                        <Animated.View
                            style={{
                                opacity: likeOpacity,
                                transform: [{ rotate: "-30deg" }],
                                position: "absolute",
                                top: 50,
                                left: 40,
                                zIndex: 1000,
                            }}
                        >
                            <Text
                                style={{
                                    borderWidth: 1,
                                    borderColor: "green",
                                    color: "green",
                                    fontSize: 32,
                                    fontWeight: '800',
                                    padding: 10,
                                }}
                            >
                                LIKE
                            </Text>
                        </Animated.View>
                        <Animated.View
                            style={{
                                opacity: dislikeOpacity,
                                transform: [{ rotate: "30deg" }],
                                position: "absolute",
                                top: 50,
                                right: 40,
                                zIndex: 1000,
                            }}
                        >
                            <Text
                                style={{
                                    borderWidth: 1,
                                    borderColor: "red",
                                    color: "red",
                                    fontSize: 32,
                                    fontWeight: '800',
                                    padding: 10,
                                }}
                            >
                                NOPE
                            </Text>
                        </Animated.View>
                    </>
                ) : null}
                
            <View style={styles.identity}>
                <Pressable onPress={onPress}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.title}>
                            {infos.name}, {infos.age} ans
                        </Text>
                        {/* <View style={{ position: "absolute", right: 0 }}>
                            <PassewordVisibilityIcon privateIcon={true} isWhite={true} customSize={25} />
                        </View> */}
                    </View>

                    <View style={styles.identityContainer}>
                        {[
                            { icon: "gender-female", text: infos.gender },
                            { icon: "map-marker", text: infos.location },
                            { icon: "paw", text: infos.breed },
                        ].map(({ icon, text }) => (
                            <Text style={styles.text} key={icon}>
                                <MaterialCommunityIcons name={icon} size={15} />
                                {getTruncatedText(text)}
                            </Text>
                        ))}
                    </View>
                </Pressable>
            </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        width: SCREEN_WIDTH * 0.84,
        height: SCREEN_HEIGHT * 0.68, // Adjust this as needed
        borderRadius: 15,
        overflow: 'hidden', // Ensure the children stay within the border radius
        position: 'relative',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    identity: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 10,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontFamily: Fonts.bold,
    },
    identityContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        
        textTransform: "capitalize",
        fontFamily: Fonts.light,
    },
});

export default CardSwipe;
