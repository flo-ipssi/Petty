import React, { useEffect, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";
import ConversationItem from "./ConversationItem";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import { upldateNotification } from "@/store/notification";
import { useDispatch } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RessourceNotAvailable from "@/ui/RessourceNotAvailable";
import client from "@/api/client";

const ConversationList = ({ navigation }) => {
    const dispatch = useDispatch();
    const [haveNewMessages, setHaveNewMessages] = useState(false);
    const [conversations, setConversations] = useState();

    const handleNewPress = () => {
        setHaveNewMessages(true);
    };

    const renderItem = ({ item }) => {
        if (item.newMessage) {
            handleNewPress();
        }

        const photo = item.petUploads
            .filter((item: { profil: boolean }) => item.profil == true)
            .map((item) => item.file.url);

        const petInfos = { infos: item.petInfo[0], photo }
        return (
            <ConversationItem
                data={item}
                onClick={() =>
                    navigation.navigate("Conversation", { conversationId: item._id, petInfos })
                }
            />
        );
    };

    async function getConversationList() {
        try {
            const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
            if (!token) return;
            const data = await fetch(client + `conversation/match`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`,
                },
            });

            const res = await data.json();

            if (res.conversations) {
                setConversations(res.conversations);
            }
        } catch (error) {
            dispatch(upldateNotification({ message: error, type: "error" }));
        }
    }

    useEffect(() => {
        getConversationList();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.boutons}>
                    Tous les messages
                </TouchableOpacity>
                <TouchableOpacity style={styles.boutons}>
                    Non lus
                    {haveNewMessages ? (
                        <View
                            style={{
                                backgroundColor: colors.DARK,
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                position: "absolute",
                                top: 15,
                                left: 20,
                            }}
                        ></View>
                    ) : null}
                </TouchableOpacity>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false}>
                {conversations?.length > 0 ? (
                    <FlatList
                        data={conversations}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id.toString()}
                    />
                ) : <RessourceNotAvailable
                    title="Aucuns match"
                    icon={<MaterialCommunityIcons 
                        name="gesture-swipe-horizontal"
                        size={45}
                        color={colors.DARK} />}
                    message="Lorsque tu matcheras avec les propriétaires, tes matchs seront affichés ici."
                />}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        fontFamily: Fonts.regular,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
    },
    boutons: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
});

export default ConversationList;
