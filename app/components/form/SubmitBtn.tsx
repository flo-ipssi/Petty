import { useFormikContext } from 'formik';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import AppButton from '@/ui/AppButton';
import colors from '@/utils/colors';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit, isSubmitting} = useFormikContext();
  return <AppButton
    onPress={handleSubmit}
    title={props.title}
    busy= {isSubmitting} 
    styleCustomContainer={styles.container}
    styleCustomTitle={{
      color: '#FFF',
      fontWeight: '600'
    }}
  />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.SECONDARY,
    borderWidth: 2,
    borderColor: colors.SECONDARY_BORDER,
    alignSelf: 'center',
    width: "45%",
    marginTop: 10
  },
});

export default SubmitBtn;
