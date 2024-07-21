import React, { FC } from "react";
import { StyleSheet, View, Modal, TouchableOpacity, Text } from "react-native";
import colors from "@/utils/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Fonts } from "@/utils/fonts";

interface Props {
  visible: boolean;
  customMessage?: string;
  onClose(): void;
  onSelectFromGallery?(): void;
  onTakePhoto?(): void;
  onCustomPress?(): void;
}

const CustomModal: FC<Props> = ({
  visible,
  customMessage,
  onClose,
  onSelectFromGallery,
  onTakePhoto,
  onCustomPress,
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {onSelectFromGallery ? (
              <TouchableOpacity
                onPress={onSelectFromGallery}
                style={styles.button}
              >
                <MaterialCommunityIcons
                  name="image"
                  size={25}
                  color={colors.DARK}
                />
                <Text style={[styles.buttonText, { color: colors.DARK }]}>
                  Sélectionner depuis la galerie
                </Text>
              </TouchableOpacity>
            ) : null}
            {onTakePhoto ? (
              <TouchableOpacity onPress={onTakePhoto} style={styles.button}>
                <MaterialIcons
                  name="add-a-photo"
                  size={25}
                  color={colors.DARK}
                />
                <Text style={[styles.buttonText, { color: colors.DARK }]}>
                  Prendre une photo
                </Text>
              </TouchableOpacity>
            ) : null}
            {onCustomPress && customMessage ? (
              <TouchableOpacity onPress={onCustomPress} style={styles.button}>
                <MaterialCommunityIcons
                  name="check"
                  size={25}
                  color={colors.DARK}
                />
                <Text style={[styles.buttonText, { color: colors.DARK }]}>
                  {customMessage}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.buttonText, { color: colors.ERROR }]}>
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 5,
    color: colors.GRAY,
    padding: 10,
    marginTop: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.ERROR,
    color: colors.ERROR,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    textAlign: "center",
    fontSize: 14,
    marginHorizontal: 10,
  },
});

export default CustomModal;
