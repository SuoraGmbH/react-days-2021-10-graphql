import { useState } from "react";
import { gql } from "@apollo/client";
import {
  useAllMessagesQuery,
  useSendMessageMutation,
} from "../generated/graphql";

gql`
  query AllMessages {
    messages {
      id
      text
      createdAt
      author {
        firstName
        lastName
      }
    }
  }
`;

gql`
  mutation SendMessage($text: String!, $authorId: ID!) {
    sendMessage(text: $text, authorId: $authorId) {
      id
    }
  }
`;

interface NewMessage {
  authorId: string;
  text: string;
}

interface Person {
  firstName: string;
  lastName: string;
}

export interface Message {
  id: string;
  text: string;
  author: Person;
}

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "message-1",
      text: "Hello there, this is a test message.",
      author: {
        firstName: "Jan",
        lastName: "Krausenbaum",
      },
    },
    {
      id: "message-2",
      text: "Hey, this is a second test message.",
      author: {
        firstName: "Florian",
        lastName: "Sowade",
      },
    },
  ]);

  const { data } = useAllMessagesQuery();
  const [sendMessageMutation, { error }] = useSendMessageMutation();
  console.log(data?.messages);

  const sendMessage = (message: NewMessage): void => {
    sendMessageMutation({
      variables: { authorId: message.authorId, text: message.text },
    });
  };

  return {
    messages: data ? data.messages : [],
    sendMessage,
  };
};

export default useMessages;
