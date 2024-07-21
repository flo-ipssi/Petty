import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import AuthNavigator from "./AuthNavigator";
import { useDispatch, useSelector } from "react-redux";
import {
    getAuthState,
    updateBusyState,
    updateLoggedInState,
    updateProfile,
} from "@/store/auth";
import TabNavigator from "./TabNavigator";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import colors from "@/utils/colors";
import { upldateFilter } from "@/store/filter";
import Loader from "@/ui/Loader";
import catchAsyncError from "@/api/catchError";
import client from "@/api/client";

interface Props { }

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.CONTRAST,
        primary: colors.PRIMARY,
    },
};
const AppNavigator: FC<Props> = (props) => {
    const { loggedIn, busy } = useSelector(getAuthState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBusyState(true));
        const fetchAuthInfo = async () => {
            try {
                const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
                if (!token) return;

                const response = await fetch(client + "auth/is-auth", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    // Servor error
                    let errorResponse = await response.json();
                    const errorMessage = catchAsyncError(errorResponse.error);
                    // dispatch(
                    //     upldateNotification({ message: errorMessage, type: "error" })
                    // );
                } else {
                    const data = await response.json();

                    dispatch(updateLoggedInState(true));
                    dispatch(updateProfile(data.profile));
                }
                dispatch(updateBusyState(false));
            } catch (error) {
                console.log("Auth error: " + error);
            }
        };
        const fetchFilters = async () => {
            try {
                const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
                if (!token) return;

                const reponse = await fetch(client + "filter/update-filters", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await reponse.json();

                dispatch(upldateFilter(data.filter));
            } catch (error) {
                console.log("Filter error: " + error);
            }
        };
        fetchAuthInfo().then(() => {
            dispatch(updateBusyState(false));
        });
        fetchFilters();
    }, []);

    return (
        <NavigationContainer theme={AppTheme} independent={true}>
            {busy ? (
                <View style={styles.loader}>
                    <Loader />
                </View>
            ) : loggedIn ? (
                <TabNavigator />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loader: {
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.OVERLAY,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
});

export default AppNavigator;
