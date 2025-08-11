import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  isChatOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do Cronograma Modular. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Olá! Sou o assistente virtual do Cronograma Modular. Como posso ajudar você hoje?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Mock responses for different queries
  const getBotResponse = useCallback((query: string): string => {
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedQuery.includes('olá') || normalizedQuery.includes('oi') || normalizedQuery.includes('bom dia')) {
      return 'Olá! Como posso ajudar você com o Cronograma Modular?';
    }
    
    if (normalizedQuery.includes('filtro') || normalizedQuery.includes('filtrar')) {
      return 'Para filtrar tarefas, use o painel de filtros à esquerda do Cronograma. Você pode filtrar por Tipo de Desenvolvimento, Categoria, Tipo de Projeto ou Objetivo.';
    }
    
    if (normalizedQuery.includes('exportar') || normalizedQuery.includes('excel') || normalizedQuery.includes('csv') || normalizedQuery.includes('pdf')) {
      return 'Para exportar dados, clique no botão "Exportar" no canto superior direito da tabela e selecione o formato desejado (Excel, CSV ou PDF).';
    }

    if (normalizedQuery.includes('análise') || normalizedQuery.includes('embalagem') || normalizedQuery.includes('esp')) {
      return 'O Sistema de Análise de Embalagens está disponível na seção "Análise de Embalagens". Lá você pode conectar o microcontrolador ESP e realizar análises com a câmera.';
    }

    if (normalizedQuery.includes('ajuda') || normalizedQuery.includes('suporte')) {
      return 'Estou aqui para ajudar! Você pode me perguntar sobre como usar filtros, exportar dados, analisar embalagens, ou qualquer outro recurso do sistema.';
    }
    
    return 'Não tenho uma resposta específica para isso, mas posso ajudar com dúvidas sobre filtros, exportação de dados, análise de embalagens e outros recursos do sistema. Poderia reformular sua pergunta?';
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot thinking and responding
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  }, [getBotResponse]);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isChatOpen,
        isLoading,
        openChat,
        closeChat,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot deve ser usado dentro de um ChatbotProvider');
  }
  return context;
};

export default ChatbotProvider;