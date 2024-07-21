import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import client from "@/api/client";
import React, { FC, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { useDispatch } from "react-redux";
import { upldateNotification } from "@/store/notification";
import CardSwipe from "@/ui/CardSwipe";
import RessourceNotAvailable from "@/ui/RessourceNotAvailable";
import RoundButtonWithImage from "@/ui/RoundButtonWithImage";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";

interface Props {
  navigation: NavigationProp<any>;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const SwipeList: FC<Props> = ({ navigation }) => {
  const [list, setList] = useState<any[]>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  const handleNavigation = (infos: any) => {
    navigation.navigate("PetDetails", { title: infos.name ,details: infos });
  };
  const position = new Animated.ValueXY();

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const rotateAndTranslate = {
    transform: [{ rotate: rotate }, ...position.getTranslateTransform()],
  };

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: "clamp",
  });

  async function fetchPets() {
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
    if (!token) return;

    try {
      const res = await fetch(client + `filter/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data) {
        setList(data.cards);
      }
    } catch (error) {
      dispatch(
        upldateNotification({
          message: (error as Error).message || "Une erreur s'est produite",
          type: "error",
        })
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  async function likeChoice(id: string, choiceSwipe: boolean) {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;
      await fetch(client + "swipe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId: id,
          like: choiceSwipe,
        }),
      });
    } catch (error) {
      dispatch(
        upldateNotification({
          message: (error as Error).message || "Une erreur s'est produite",
          type: "error",
        })
      );
    }
    
    if (list?.length == 0) {
      fetchPets();
    }
  }

  const getPanResponderHandler = (itemId: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(currentIndex + 1);
            position.setValue({ x: 0, y: 0 });
          });
          likeChoice(itemId, true);
        } else if (gestureState.dx < -120) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(currentIndex + 1);
            position.setValue({ x: 0, y: 0 });
          });
          likeChoice(itemId, false);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    });

  const renderPets = () => {
    if (list != null && list != undefined && list.length > 0) {
      return list
        ?.map((item: any, i: number) => {
          if (i < currentIndex) {
            return null;
          } else if (i == currentIndex) {
            const panResponderHandler = getPanResponderHandler(item._id);
            return (
              <Animated.View
                key={i}
                {...panResponderHandler.panHandlers}
                style={[
                  rotateAndTranslate,
                  {
                    height: SCREEN_HEIGHT - 170,
                    width: SCREEN_WIDTH,
                    padding: 20,
                    position: "absolute",
                  },
                ]}
              >
                <CardSwipe
                  position={position}
                  onPress={() => handleNavigation(item)}
                  infos={item}
                />
              </Animated.View>
            );
          } else {
            return (
              <Animated.View
                key={i}
                style={[
                  {
                    opacity: nextCardOpacity,
                    transform: [{ scale: nextCardScale }],
                    height: SCREEN_HEIGHT - 170,
                    width: SCREEN_WIDTH,
                    padding: 20,
                    position: "absolute",
                  },
                ]}
              >
                <CardSwipe infos={item} />
              </Animated.View>
            );
          }
        })
        .reverse();
    } else {
      return (
        <RessourceNotAvailable
          title="Oops!"
          message="Aucun animaux disponible :("
        />
      );
    }
  };

  const handlePressLeftButton = () => {
    Animated.spring(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
      
    });
    // likeChoice(itemId, true)
  };

  const handlePressRightButton = () => {
    Animated.spring(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
      
    });
    console.log(currentIndex);
    // likeChoice(itemId, false)
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 4 }}>{renderPets()}</View>
      <View style={styles.buttonContainer}>
        <View style={styles.itemButtonContainer}>
          <RoundButtonWithImage
            onPress={handlePressLeftButton}
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
            onPress={handlePressRightButton}
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
  container: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  itemButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20, // Pour arrondir les coins
  },
});

export default SwipeList;
