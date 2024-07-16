import React, { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";

interface Props {
    data: any;
    onClick?(): void;
}

const ConversationItem: FC<Props> = ({ data, onClick }) => {
    const petProfil = data.petUploads
        .filter((item: { profil: boolean }) => item.profil == true)
        .map((item: { file: { url: any; }; }) => item.file.url);

    return (
        <TouchableOpacity style={styles.row} onPress={onClick}>
            <View style={{ flexDirection: "row", padding: 10 }}>
                <Image
                    source={petProfil[0]}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ marginLeft: 25 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            // fontFamily: !data.messages[0].is_Seen ? Fonts.bold : Fonts.regular,
                            fontFamily: !data.messages[0] ? Fonts.bold : Fonts.regular,
                        }}
                    >
                        {data.petInfo[0].name}
                    </Text>
                    <Text
                        style={{
                            fontFamily: data.newMessage ? Fonts.bold : Fonts.regular,
                            color: "rgba(84, 84, 84, 0.6)",
                        }}
                    >
                        {data.messages[0]?.message ?? null }
                    </Text>
                </View>
                {!data.messages[0] ? (
                    <View
                        style={{
                            backgroundColor: colors.DARK,
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            position: "absolute",
                            top: 20,
                            right: 20,
                        }}
                    ></View>
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {},

    row: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.GRAY,
        width: "80%",
        alignSelf: "center",
    },
});

export default ConversationItem;
