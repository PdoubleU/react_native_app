import { View, Text, TextInput } from "react-native";
import { GET_MESSAGES, POST_MESSAGE } from "./ApolloClient";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
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

    useLayoutEffect(() => {
        if(data && data.messages)
        {
            let { messages: { data: setOfMsgs} } = data;
            setMessages([...setOfMsgs]);
        }
    }, [data])

    const onSend = useCallback((messages = []) => {
      if(messages.length > 0) {
          postMessage({
                variables: {
                    user: user,
                    text: messages[0].text
                }
          });
          setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }
    }, [user])

    return (
        <>
            <GiftedChat
                messages={messages}
                inverted={false}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user,
                }}
            />
        </>
    );
}

export default Message;