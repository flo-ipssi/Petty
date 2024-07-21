import React, { FC, useCallback, useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "@/utils/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AvatarField from "@/ui/AvatarField";
import { useDispatch, useSelector } from "react-redux";
import {
    getAuthState,
    updateBusyState,
    updateLoggedInState,
    updateName,
    updateProfile,
} from "@/store/auth";
import deepEqual from "deep-equal";
import { upldateNotification } from "@/store/notification";
import catchAsyncError from "@/api/catchError";
import {
    Keys,
    getFromAsyncStorage,
    removeFromAsyncStorage,
} from "@/utils/asyncStorage";
import { useFetchAvatar } from "@/hooks/query";
import { Fonts } from "@/utils/fonts";
import _ from "lodash";
import client from "@/api/client";

interface Props { }
interface ProfileInfo {
    name: string;
    avatar?: string;
}

const SettingTab: FC<Props> = (props) => {
    const [userInfo, setUserInfo] = useState<ProfileInfo>({ name: "" });
    const [busy, setBusy] = useState(false);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const dispatch = useDispatch();
    const { profile } = useSelector(getAuthState);

    const { data } = useFetchAvatar(profile.id);
    const isSame = deepEqual(userInfo, {
        name: profile?.name,
        avatar: profile?.avatar,
    });

    const handleLogout = async (fromAll?: boolean) => {
        dispatch(updateBusyState(true));
        try {
            const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
            if (!token) return;
            await fetch(
                client + "auth/log-out?fromAll=" + (fromAll ? "yes" : ""),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await removeFromAsyncStorage(Keys.AUTH_TOKEN);
            dispatch(updateProfile(null));
            dispatch(updateLoggedInState(false));
        } catch (error) {
            const errorMessage = catchAsyncError(error);
            dispatch(upldateNotification({ message: errorMessage, type: "error" }));
        }
        dispatch(updateBusyState(false));
    };

    const handleDeleteAccount = () => {
        // Code pour supprimer le compte de l'utilisateur
    };

    const handleToggleVisibility = () => {
        // Code pour basculer le mode de visibilité du compte
    };

    const handleSubmit = async () => {
        setBusy(true);
        try {
            if (!userInfo.name.trim())
                return dispatch(
                    upldateNotification({
                        message: "Profile name is require!",
                        type: "error",
                    })
                );
            const formData = new FormData();
            formData.append("name", userInfo.name);

            if (userInfo.avatar) {
                formData.append("avatar", {
                    name: "avatar",
                    type: "image/jpeg",
                    uri: userInfo.avatar,
                });
            }

            const client = await getClient({
                "Content-Type": "multipart/form-data;",
            });
            const { data } = await client.post("/auth/update-profile", formData);
            dispatch(updateProfile(data.profile));
            dispatch(
                upldateNotification({
                    message: "Your profile is updated.",
                    type: "success",
                })
            );
        } catch (error) {
            const errorMessage = catchAsyncError(error);
            dispatch(upldateNotification({ message: errorMessage, type: "error" }));
        }
        setBusy(false);
    };

    const handleImageSelect = async () => {
        // try {
        //     await getPermissionToReadImages();
        //     const { path } = await ImagePicker.openPicker({
        //         cropping: true,
        //         width: 300,
        //         height: 300,
        //     });
        //     setUserInfo({ ...userInfo, avatar: path });
        // } catch (error) {
        //     console.log(error);
        // }
    };

    const handleTextChange = (inputText: React.SetStateAction<string>) => {
        setName(inputText);
        saveName(inputText);
    };
    const saveName = useCallback(
        _.debounce(async (newName) => {
            // Exemple d'appel API avec un token
            const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
            if (!token) return;

            try {
                const res = await fetch(client + `profile/save/infos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ newName: newName }),
                });
                const data = await res.json();
                console.log("Name saved:", data);

                dispatch(updateName(newName))
                return data;
            } catch (error) {
                console.error("Error saving description", error);
            }
        }, 1000),
        []
    );
    useEffect(() => {
        if (profile) {
            setName(profile.name)
            setAvatar(profile.avatar)
        }
    }, [profile]);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Paramètres</Text>
            </View>

            <View style={styles.settingOptionsContainer}>
                <View style={styles.avatarContainer}>
                    {/* <AvatarField source={userInfo.avatar} /> */}
                    <AvatarField source={avatar} />
                    <Pressable onPress={handleImageSelect} style={styles.paddingLeft}>
                        <Text style={styles.linkText}>Profil</Text>
                        <View style={styles.emailConainer}>
                            <Text style={styles.email}>{profile?.email}</Text>
                            <MaterialIcons
                                name="verified"
                                size={15}
                                color={colors.SECONDARY}
                            />
                        </View>
                    </Pressable>
                </View>
                <TextInput
                    onChangeText={handleTextChange}
                    style={styles.nameInput}
                    value={name}
                />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Déconnexion</Text>
            </View>

            <View style={styles.settingOptionsContainer}>
                {/* <TouchableOpacity
                    onPress={() => handleLogout}
                    style={[styles.button, styles.buttonColor, styles.logoutBtn]}
                >
                    <AntDesign name="logout" size={20} color={colors.INACTIVE_CONTRAST} />
                    <Text style={styles.logoutBtnTitle}>Se déconnecter</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={() => handleLogout(true)}
                    style={[styles.button, styles.buttonColor, styles.logoutBtn]}
                >
                    <AntDesign name="logout" size={20} color={colors.INACTIVE_CONTRAST} />
                    <Text style={styles.logoutBtnTitle}>
                        Se déconnecter
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteAccount}
                    style={[styles.button, styles.buttonColor, styles.deleteAccount, styles.logoutBtn]}
                >
                    <Entypo name="trash" size={20} color={colors.INACTIVE_CONTRAST} />
                    <Text style={styles.logoutBtnTitle}>Supprimer le compte</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    titleContainer: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.SECONDARY,
        paddingBottom: 5,
        marginTop: 15,
        marginHorizontal: 20
    },
    title: {
        fontWeight: 900,
        fontSize: 18,
        color: colors.SECONDARY,
    },
    settingOptionsContainer: {
        marginTop: 15,
        paddingHorizontal: 25,
    },
    avatarContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    linkText: {
        color: colors.SECONDARY,
        fontStyle: "normal",
        fontFamily: Fonts.regular,
    },
    paddingLeft: {
        paddingLeft: 15,
    },
    nameInput: {
        color: colors.DARK,
        fontWeight: 700,
        fontSize: 15,
        padding: 10,
        borderWidth: 0.5,
        borderColor: colors.DARK,
        borderRadius: 7,
        marginTop: 15,
    },
    emailConainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    email: {
        color: colors.DARK,
        marginRight: 10,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    deleteAccount: {
        backgroundColor: colors.ERROR
    },
    logoutBtnTitle: {
        color: "#FFF",
        fontSize: 15,
        marginLeft: 5,
        marginRight: 5,
        fontFamily: Fonts.bold
    },
    marginTop: {
        marginTop: 15,
    },
    buttonColor: {
        backgroundColor: colors.SECONDARY,
    },
    invisible: {
        color: colors.DARK,
        backgroundColor: colors.GRAY,
        borderWidth: 1,
        borderColor: colors.DARK,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default SettingTab;
