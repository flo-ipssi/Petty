import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import EnrypoIcon from "@expo/vector-icons/Entypo";
import colors from "@/utils/colors";

interface Props {
  source?: string;
}

const avatarSize = 70;

const AvatarField: FC<Props> = ({ source }) => {
  return (
    <View>
      {source ? (
        <Image source={{ uri: source }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarImage}>
          <EnrypoIcon name="mic" size={30} color={colors.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.INACTIVE_CONTRAST,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.PRIMARY,
  },
});

export default AvatarField;
