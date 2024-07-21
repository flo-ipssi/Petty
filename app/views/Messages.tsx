import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ConversationList from "./conversation/ConversationList";
import Conversation from "./conversation/Conversation";

interface Props { }

const Stack = createStackNavigator();

const Messages: FC<Props> = (props) => {

  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          options={{ title: 'Messages' }}
          name="ConversationList"
          component={ConversationList} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          options={({ route }) => ({
            title: route.params?.title || 'Conversation',
          })}
          name="Conversation"
          component={Conversation} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Messages;
