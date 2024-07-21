import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Image } from 'expo-image';
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
        index={0}
        showPagination
        data={slideList}
        renderItem={({ item }) => (
          <View style={[styles.child]}>
            <Image
              source={{ uri: item.file.url }}
              resizeMode="cover"
              style={styles.image}
            />
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
    width: '100%',
    height: '100%',
  },
});

export default CarrouselComponent;
