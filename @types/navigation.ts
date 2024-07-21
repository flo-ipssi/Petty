interface NewUserResponse {
    id: string,
    name: string,
    email: string
}

export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    LostPassword: undefined;
    Verification: {userInfo: NewUserResponse};
}

export type LoggedInStackParamList = {
    Home: undefined;
    Apartment: undefined;
    Profile: undefined;
    Messages: undefined;
}

export type MessagesInStackParamList = {
    Messages: undefined;
    ConversationList: undefined;
    Conversation: {conversationId: string, petInfos: any};
}
