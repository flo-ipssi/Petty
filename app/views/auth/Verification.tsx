import React, { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthFormConainer from '@/components/AuthFormConainer';
import OTPField from '@/ui/OTPField';
import AppLink from '@/ui/AppLink';
import AppButton from '@/ui/AppButton';
import colors from '@/utils/colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import client from '@/api/client';
import { useDispatch } from 'react-redux';
import catchAsyncError from '@/api/catchError';
import { upldateNotification } from '@/store/notification';


type Props = NativeStackScreenProps<AuthStackParamList, "Verification">
const otpFields = new Array(6).fill('')

const Verification: FC<Props> = ({ route }) => {

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const [otp, setOtp] = useState([...otpFields]);
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [countDown, setCountDown] = useState(60);
    const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const dispatch = useDispatch()
    const { userInfo } = route.params;

    const isValidOTP = otp.every(value => {
        return value.trim()
    })
    const handleSubmit = async () => {
        if (!isValidOTP) return;

        setSubmitting(true)
        try {
            const reponse = await fetch(client + "auth/verify-email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userInfo.id,
                    token: otp.join('')
                }),
            });

            if (!reponse.ok) {
                // Servor error
                const erreurServeur = await reponse.json();
                console.error('Erreur du serveur:', erreurServeur);
            } else {
                navigation.navigate('SignIn');
            }

        } catch (erreur) {
            // Connexion errors
            console.error('Erreur lors de la requête:', erreur);
        }
        setSubmitting(false)
    }


    const handleChange = (value: string, index: number) => {
        const newOtp = [...otp];
        if (value === "Backspace") {
            // moves to the previous inly if the field is empty
            setActiveOtpIndex(index - 1)
            newOtp[index] = ''
        } else {
            // uptdate otp and move to the next
            setActiveOtpIndex(index + 1)
            newOtp[index] = value
        }

        setOtp([...newOtp])
    }

    // Handle the paste of the code in the 6 fields
    const handlePaste = (value: string) => {
        if (value.length === 6) {
            // Remove the focus
            Keyboard.dismiss()
            const newOtp = value.split('')
            setOtp([...newOtp])
        }
    };

    // Reverify the email
    const requestOTP = async () => {
        setCountDown(60);
        setCanSendNewOtpRequest(false);

        try {
            const reponse = await fetch(client + "auth/re-verify-email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Permet les requêtes depuis toutes les origines
                },
                body: JSON.stringify({
                    userId: userInfo.id
                }),
            });

        } catch (erreur) {
            // Connexion errors
            let errorResponse = erreur;
            const errorMessage = catchAsyncError(errorResponse.error);
            dispatch(upldateNotification({ message: errorMessage, type: 'error' }));
        }

    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

    useEffect(() => {
        if (canSendNewOtpRequest) return;

        const intervalId = setInterval(() => {
            setCountDown((oldCountDown) => {
                if (oldCountDown <= 0) {
                    setCanSendNewOtpRequest(true);
                    clearInterval(intervalId);

                    return 0
                }
                return oldCountDown - 1
            })
        }, 1000);

        return () => {
            clearInterval(intervalId)
        }
    }, [canSendNewOtpRequest]);


    return (
        <AuthFormConainer
            heading='Vérification de votre email'

        >
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    {otpFields.map((_, index) => {
                        return <OTPField
                            ref={activeOtpIndex === index ? inputRef : null}
                            onKeyPress={({ nativeEvent }) => {
                                handleChange(nativeEvent.key, index)
                            }}
                            keyboardType="number-pad"
                            onChangeText={handlePaste}
                            key={index}
                            placeholderTextColor={colors.DARK}
                            placeholder='*'
                            value={otp[index] || ''} />;
                    })}
                </View>
                <AppButton
                    title={"Envoyer".toLocaleUpperCase()}
                    busy={submitting}
                    styleCustomContainer={styles.customButton}
                    styleCustomTitle={styles.customTitleButton}
                    onPress={handleSubmit}
                />
            </View>

            <View style={styles.linkContainer}>
                {countDown > 0 ? <Text style={styles.countDown}>{countDown} sec</Text> : null}
                <AppLink
                    active={canSendNewOtpRequest}
                    title='Renvoyer le code'
                    onPress={requestOTP} />
            </View>
        </AuthFormConainer>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30, // padding in the x direction (left and the right)
    },
    inputContainer: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center"
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    },
    customButton: {
        backgroundColor: colors.SECONDARY_TRANSPARENT,
        borderWidth: 2,
        borderColor: colors.SECONDARY_BORDER,
        width: "45%",
        marginTop: 15
    },
    customTitleButton: {
        color: '#FFF',
        fontWeight: 600
    },
    countDown: {
        color: colors.SECONDARY,
        marginRight: 7
    }
});

export default Verification;
