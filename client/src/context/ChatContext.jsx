import { createContext, useCallback, useContext, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState('');

  const openChat = useCallback((prompt = '') => {
    if (prompt) setPendingPrompt(prompt);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const toggleChat = useCallback(() => setIsOpen((o) => !o), []);

  const consumePendingPrompt = useCallback(() => {
    const p = pendingPrompt;
    setPendingPrompt('');
    return p;
  }, [pendingPrompt]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        openChat,
        closeChat,
        toggleChat,
        pendingPrompt,
        consumePendingPrompt,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) return { openChat: () => {}, closeChat: () => {}, toggleChat: () => {}, isOpen: false };
  return ctx;
}
