import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
    persist(
        (set, get) => ({
            messages: [],
            addMessage: (message) => {
                const updated = [...get().messages, message];
                set({ messages: updated });
            },

            setMessages: (messages) => set({ messages }),

            clearMessages: () => set({ messages: [] }),
        }),

        {
            name: 'chat-storage', 
        }
    )
);