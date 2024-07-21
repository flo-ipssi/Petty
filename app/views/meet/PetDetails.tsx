import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Fonts } from "@/utils/fonts";
import colors from "@/utils/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RoundButtonWithImage from "@/ui/RoundButtonWithImage";
import CarrouselComponent from "@/components/CarrouselComponent";
import { useNavigation } from "@react-navigation/native";
import { Image } from 'expo-image';

interface Props {
  route : any
 }

const { width: screenWidth } = Dimensions.get("window");

const PetDetails: FC<Props> = ({ route }) => {
  const { details } = route.params;
  const navigation = useNavigation();


  const handleDislike = () => {
    navigation.goBack();
  };

  const handleLike = () => {
   navigation.goBack();
  };

  const handleNextProfile = () => {
    // navigation.navigate('Home', { triggerAction: 'someValue' });
  };

  const getImageSource = (uploads: any[]) => {
    const profileImage = uploads.find((item: { profil: boolean; }) => item.profil);
    return profileImage ? { uri: profileImage.file.url } : require('@/assets/1.jpg');
  };
  console.log(details.user.uploads.filter((item: { profil: boolean; }) => item.profil)[0].file.url);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <CarrouselComponent slideList={details.uploads} />
        <View style={styles.infoContainer}>
          <View style={styles.leftTextContainer}>
            <Text style={styles.leftText}>{details.name}</Text>
          </View>

          <View style={styles.rightTextContainer}>
            <Text style={styles.rightText}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={colors.DARK}
              />
              {details.location}
            </Text>
          </View>
        </View>
        <View style={styles.infoPetContainer}>
          <View style={styles.box}>
            <Text style={styles.titleBox}>Sexe</Text>
            <Text style={styles.responseBox}>{details.gender}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.titleBox}>Age</Text>
            <Text style={styles.responseBox}>{details.age} ans</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.titleBox}>Poids</Text>
            <Text style={styles.responseBox}>{details.weight} kg</Text>
          </View>
        </View>
        <View style={styles.infoPetContainer}>
          <Text style={{ marginVertical: 25 }}>{details.description}</Text>
        </View>
        <View style={{ flexDirection: 'row', padding: 10, marginHorizontal: 30 }}>
          <Image
            source={getImageSource(details.user.uploads)}
            style={{ width: 45, height: 45, borderRadius: 25 }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.bold,
                textTransform: 'capitalize',
              }}
            >
              {details.user.name}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: 'rgba(84, 84, 84, 0.6)',
              }}
            >
              Pet owner | {details.user.company ? 'Association' : 'Particulier'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.itemButtonContainer}>
          <RoundButtonWithImage
            onPress={handleDislike}
            imageSource={require("@/assets/logos/cross.png")}
            stylesCustom={{
              background: "linear-gradient(90deg, #ff3131, #ff914d)",
              alignSelf: "flex-end",
              marginRight: 40,
            }}
          />
        </View>
        <View style={styles.itemButtonContainer}>
          <RoundButtonWithImage
            onPress={handleLike}
            imageSource={require("@/assets/logos/paw-white.png")}
            stylesCustom={{
              background: "linear-gradient(90deg, #5de0e6, #004aad)",
              alignSelf: "flex-start",
              marginLeft: 40,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  item: {
    width: screenWidth,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
  },
  titleBox: {
    color: colors.DARK,
    alignSelf: "center",
    fontFamily: Fonts.thin,
  },
  responseBox: {
    color: colors.SECONDARY,
    fontFamily: Fonts.regular,
  },
  box: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    textAlign: "center",
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "rgba(57, 254, 226, 0.1)",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  navItem: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: "blue",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    left: "25%",
  },
  itemButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20, // Pour arrondir les coins
  },
  infoContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
    fontFamily: Fonts.regular,
  },
  infoPetContainer: {
    paddingHorizontal: 40,
    flexDirection: "row",
    width: "100%",
    fontFamily: Fonts.regular,
  },
  leftTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  leftText: {
    fontSize: 20,
    fontFamily: Fonts.medium,
  },
  rightTextContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  rightText: {
    textTransform: "capitalize",
    fontSize: 17,
  },
});

export default PetDetails;
