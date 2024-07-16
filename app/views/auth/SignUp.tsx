import AuthInputField from '@/components/form/AuthInputField';
import Form from '@/components/form';
import React, { FC, useState } from 'react';
import { StyleSheet, View, } from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@/components/form/SubmitBtn';
import PassewordVisibilityIcon from '@/ui/PassewordVisibilityIcon';
import AppLink from '@/ui/AppLink';
import AuthFormConainer from '@/components/AuthFormConainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';
import { FormikHelpers } from 'formik';
import client from '@/api/client';
import { useDispatch } from 'react-redux';
import { upldateNotification } from '@/store/notification';
import catchAsyncError from '@/api/catchError';

// Schema de validation
const signupSchema = yup.object().shape({
  name: yup.string().trim().min(3).required('Name is required!'),
  phone: yup.string()
  .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
  .required('Phone number is required!'),
  email: yup.string().trim().email().required('Email is required!'),
  password: yup.string().trim().min(8)
    // .matches(
    //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@/#\$%\^&\*])[a-zA-Z\d!@/#\$%\^&\*]+$/,
    //   'Password is too simple!',
    // )
    .matches(/^(?=.*[a-zA-Z\d])(?=.*[!@/#$%^&*]).*$/, 'Password is too simple!')
    .required('Password is required!'),
});

interface Props { }

interface NewUser {
  name: '';
  email: '';
  phone: '';
  password: '';
}


const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {

  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const dispatch = useDispatch()

  const togglePassword = () => {
    setSecureEntry(!secureEntry)
  };

  const linkHeading = () => {
    navigation.navigate('SignIn')
  }
  
  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>
  ) => {
    
    actions.setSubmitting(true)
    try {
      const reponse = await fetch(client + "auth/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Permet les requêtes depuis toutes les origines
        },
        body: JSON.stringify(values),
      });
      
      if (!reponse.ok) {
        // Servor error
        let errorResponse = await reponse.json();
        const errorMessage = catchAsyncError(errorResponse.error);
        dispatch(upldateNotification({message: errorMessage, type: 'error'}));
      } else {
        const resultat = await reponse.json();
        navigation.navigate('Verification', { userInfo: resultat.user })
      }

    } catch (error) {
      // Connexion errors      
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }

    actions.setSubmitting(false)
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormConainer
        heading='Inscription'
        subHeading='Déjà inscrit ? Connexion'
        linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Please enter your name"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="phone"
            placeholder="06.XX.XX.XX.XX"
            label="Please enter your phone"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            placeholder="john@/email.com"
            label="Please enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Please enter your password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            rightIcon={<PassewordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePassword}
          />

          <SubmitBtn title={"Sign up".toLocaleUpperCase()} />

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
    paddingHorizontal: 30,
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

export default SignUp;
