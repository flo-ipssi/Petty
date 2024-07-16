import AuthInputField from '@/components/form/AuthInputField';
import Form from '@/components/form';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@/components/form/SubmitBtn';
import PassewordVisibilityIcon from '@/ui/PassewordVisibilityIcon';
import AppLink from '@/ui/AppLink';
import AuthFormConainer from '@/components/AuthFormConainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';
import { FormikHelpers } from 'formik';
import { updateLoggedInState, updateProfile } from '@/store/auth';
import { useDispatch } from 'react-redux';
import { Keys, saveToAsyncStorage } from '@/utils/asyncStorage';
import catchAsyncError from '@/api/catchError';
import { upldateNotification } from '@/store/notification';
import client from '@/api/client';

// Schema de validation
const signInSchema = yup.object().shape({
  email: yup.string().trim().email().required('Email is required!'),
  password: yup.string().trim().min(8)
    .required('Password is required!'),
});
interface Props { }

const initialValues = {
  email: '',
  password: '',

};

interface SignInUserInfo {
  email: string;
  password: string;
};

const SignIn: FC<Props> = props => {

  const [secureEntry, setSecureEntry] = useState(true);

  // Solve the type related problem
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  const togglePassword = () => {
    setSecureEntry(!secureEntry)
  };

  const linkHeading = () => {
    navigation.navigate('SignUp')
  }

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>) => {
    try {
  
      const reponse = await fetch(client + "auth/sign-in", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!reponse.ok) {
        // Servor error
        let errorResponse = await reponse.json();
        const errorMessage = catchAsyncError(errorResponse.error);
        dispatch(upldateNotification({message: errorMessage, type: 'error'}));
      } else {
        const results = await reponse.json();

        await saveToAsyncStorage(Keys.AUTH_TOKEN, results.token)
        dispatch(updateProfile(results.profile))
        dispatch(updateLoggedInState(true))
        // navigation.navigate('Verification', { userInfo: resultat.user })
        console.log("result: " + results);

      }
    } catch (erreur) {
      // Connexion errors
      console.error('Erreur lors de la requête:', erreur);
    }
    
    actions.setSubmitting(false)

  }
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signInSchema}>
      <AuthFormConainer
        heading='Connexion'
        subHeading='Pas encore inscrit ? Inscription'
        linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Mot de passe"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            rightIcon={<PassewordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePassword}
          />
          <SubmitBtn title={"Sign in".toLocaleUpperCase()} />

          <View style={styles.linkContainer}>
            <AppLink title='Mot de passe oublié ?' onPress={() => {
              navigation.navigate('LostPassword')
            }} />
          </View>
        </View>
      </AuthFormConainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 30
  },
  marginBottom: {
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  }
});

export default SignIn;
