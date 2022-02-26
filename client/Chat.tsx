import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import ApolloClient from "./ApolloClient";
import Message from "./Message";
import { GiftedChat } from 'react-native-gifted-chat'

interface ChatComponentProps {

}

const ChatComponent: React.FC<ChatComponentProps> = () => {
    const [ user, setUser ] = useState<string>("Piotr")
    return (
        <ApolloClient>
            <Message user={user}></Message>
            <TextInput
                value={user}
                onChangeText={input => setUser(input)}
            ></TextInput>
        </ApolloClient>
    );
}

export default ChatComponent;