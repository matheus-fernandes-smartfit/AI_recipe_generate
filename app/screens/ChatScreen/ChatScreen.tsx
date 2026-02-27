import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { sendChatMessage } from "../../api/chat";
import { makeId } from "../../utils/helpers";
import type { RootStackParamList } from "../../navigation/types";
import { theme } from "../../theme";
import { styles } from "./ChatScreen.styles";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export function ChatScreen({ navigation }: Props) {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: chatInput.trim(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setSending(true);

    try {
      const res = await sendChatMessage(userMessage.content, conversationId);
      setConversationId(res.conversationId);

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: res.reply,
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (e: unknown) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `Error: ${(e as Error)?.message ?? "failed to get response"}`,
        },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [chatInput, sending, conversationId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.smallButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.bubbleUser : styles.bubbleAssistant,
            ]}
          >
            <Text
              style={
                item.role === "user"
                  ? styles.bubbleTextUser
                  : styles.bubbleTextAssistant
              }
            >
              {item.content}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.muted}>
            Try asking: "What chicken recipes do I have?"
          </Text>
        }
      />

      <View style={styles.chatComposer}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.textMuted}
          editable={!sending}
          onSubmitEditing={sendChat}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.chatSend, sending && styles.chatSendDisabled]}
          onPress={sendChat}
          disabled={sending}
        >
          <Text style={styles.chatSendText}>{sending ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
