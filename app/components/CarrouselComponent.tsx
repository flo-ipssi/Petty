import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";

interface SlideData {
  file: {
    publicId: string;
    url: string;
  };
}

interface CarouselProps {
  slideList: SlideData[];
}

const { width, height } = Dimensions.get("window");

const CarrouselComponent: React.FC<CarouselProps> = ({ slideList }) => {
  return (
    <View style={styles.container}>
      <SwiperFlatList
        // autoplay
        // autoplayDelay={2}
        index={0}
        showPagination
        data={slideList}
        renderItem={({ item }) => (
          <View style={[styles.child]}>
            <ImageBackground
              source={item.file.url}
              resizeMode="cover"
              style={styles.image}
            ></ImageBackground>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", backgroundColor: "darkgrey" },
  child: { width, height: height - 300, justifyContent: "center" },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});

export default CarrouselComponent;
