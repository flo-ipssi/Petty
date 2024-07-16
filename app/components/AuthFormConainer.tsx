import React from 'react';
import { FC, ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppLink from '@/ui/AppLink';
import PawUi from '@/ui/PawUi';
import colors from '@/utils/colors';

interface Props {
    children?: ReactNode,
    heading?: string,
    subHeading: string,
    linkSubHeading?(): void
}

const AuthFormConainer: FC<Props> = props => {
    return <View style={styles.container}>
        <PawUi position="left-bottom" rotate="60deg" size={230} />
        <PawUi position="bottom-right" rotate="-20deg" size={230} />
        <View style={styles.headerContainer}>
            <Image style={{ width: 230, height: 230 }}
                source={require('../assets/logos/original.png')} />
            <Text style={styles.heading} >{props.heading}</Text>
            <View style={styles.subHeading}>
                <AppLink title={props.subHeading} onPress={props.linkSubHeading} />
            </View>
        </View>

        {props.children}

    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.INACTIVE_CONTRAST,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    heading: {
        color: colors.SECONDARY,
        marginBottom: 20,
        fontSize: 30,
        fontWeight: 800,
        width: "70%",
        textAlign: 'center',
    },
    subHeading: {
        marginHorizontal: 30,
        marginBottom: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    }
});

export default AuthFormConainer;