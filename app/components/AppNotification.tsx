import React, { FC, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationState, upldateNotification } from '@/store/notification';
import colors from '@/utils/colors';

interface Props { }

const AppNotification: FC<Props> = props => {
  const { message, type } = useSelector(getNotificationState);
  const height = useSharedValue(0)

  const dispatch = useDispatch()

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value
    }
  })

  let backgroundColor = colors.ERROR
  let textColor = colors.CONTRAST

  switch (type) {
    case "success":
      backgroundColor = colors.SUCCESS
      textColor = colors.PRIMARY
      break;
  }


  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const performAnimation = () => {
      height.value = withTiming(45, {
        duration: 150,
      });

      timeoutId = setTimeout(() => {
        height.value = withTiming(0, {
          duration: 150,
        });

        dispatch(upldateNotification({ message: '', type: 'error' }));
      }, 3000);
    };

    if (message) performAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [message]);

  return (
    <Animated.View style={[styles.container, { backgroundColor }, heightStyle]}>
      <Text style={[styles.message, { color: textColor }]}>
        {typeof message === 'string' ? message : 'Une erreur s\'est produite'}
      </Text>
    </Animated.View>)
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotification;