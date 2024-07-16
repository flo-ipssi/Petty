import AuthInputField from '@/components/form/AuthInputField';
import Form from '@/components/form';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@/components/form/SubmitBtn';
import AuthFormConainer from '@/components/AuthFormConainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@/@types/navigation';
import { FormikHelpers } from 'formik';
import catchAsyncError from '@/api/catchError';
import { useDispatch } from 'react-redux';
import { upldateNotification } from '@/store/notification';
import client from '@/api/client';

// Schema de validation
const lostPasswordSchema = yup.object().shape({
  email: yup.string().trim().email().required('Email is required!')
});

interface Props { }

interface InitialValues {
  email: string;
}

const initialValues = {
  email: ''
};

const LostPassword: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch()

  const linkHeading = () => {
    navigation.goBack()
  }

  const handleSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>) => {
    try {

      const reponse = await fetch(client + "auth/forget-password", {
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
        const results = await reponse.json();
        navigation.navigate('SignIn');
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
      validationSchema={lostPasswordSchema}>
      <AuthFormConainer
        heading='Mot de passe oublié'
        subHeading='Retour'
        linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Please enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title={"Envoyer".toLocaleUpperCase()} />

        </View>
      </AuthFormConainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 30, // padding in the x direction (left and the right)
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

export default LostPassword;
