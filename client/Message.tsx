import { View, Text, TextInput } from "react-native";
import { GET_MESSAGES, POST_MESSAGE } from "./ApolloClient";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

interface MessageProps {
    user: string
}

type MessageType  = {
    _id: string | number
    text: string
    createdAt: number | Date
    user: {
      _id: string | number
      name: string
      avatar: string
    }
}

const Message: React.FC<MessageProps> = ( { user }) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [ postMessage ] = useMutation(POST_MESSAGE);
    const { data } = useSubscription(GET_MESSAGES);
    console.log(user);
    console.log(typeof user);


    useEffect(() => {
        if(data && data.messages)
        {
            let { messages: messagesAmessage } = data;
            setMessages([...messagesAmessage])
        }
    }, [data])

    const onSend = useCallback((messages = []) => {
      if(messages.length > 0) {
          postMessage({
                variables: {
                    user: user,
                    text: "test"
                }
          })
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    if (!data) {
        return null;
    }

    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user,
                }}
            />
        </>
    );
}

export default Message;