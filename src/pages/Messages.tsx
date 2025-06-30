import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageCard from "@/components/MessageCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Inbox } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  body: string;
  sent_at: string;
  listing_id: string;
  from_user_id: string;
  to_user_id: string;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [sendingReplies, setSendingReplies] = useState<{ [key: string]: boolean }>({});
  
  // Get initial tab from URL params or default to 'inbox'
  const initialTab = searchParams.get('tab') === 'sent' ? 'sent' : 'inbox';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchMessages();
  }, [user]);

  // Update active tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sent' || tabParam === 'inbox') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch inbox messages (messages received by the current user)
      const { data: inboxData, error: inboxError } = await supabase
        .from('messages')
        .select('id, body, sent_at, listing_id, from_user_id, to_user_id')
        .eq('to_user_id', user.id)
        .order('sent_at', { ascending: false });

      if (inboxError) {
        console.error('Error fetching inbox messages:', inboxError);
      } else {
        setInboxMessages(inboxData || []);
      }

      // Fetch sent messages (messages sent by the current user)
      const { data: sentData, error: sentError } = await supabase
        .from('messages')
        .select('id, body, sent_at, listing_id, from_user_id, to_user_id')
        .eq('from_user_id', user.id)
        .order('sent_at', { ascending: false });

      if (sentError) {
        console.error('Error fetching sent messages:', sentError);
      } else {
        setSentMessages(sentData || []);
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyTextChange = (messageId: string, value: string) => {
    setReplyTexts(prev => ({
      ...prev,
      [messageId]: value
    }));
  };

  const handleSendReply = async (originalMessage: Message) => {
    if (!user) return;

    const replyText = replyTexts[originalMessage.id]?.trim();
    if (!replyText) {
      toast({
        title: "Error",
        description: "Por favor, escribe una respuesta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setSendingReplies(prev => ({
      ...prev,
      [originalMessage.id]: true
    }));

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: originalMessage.from_user_id,
          listing_id: originalMessage.listing_id,
          body: replyText
        });

      if (error) {
        console.error('Error sending reply:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar la respuesta. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Respuesta enviada correctamente.",
        });
        
        // Clear the reply text
        setReplyTexts(prev => ({
          ...prev,
          [originalMessage.id]: ''
        }));
        
        // Refresh messages to show the new reply in sent messages
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSendingReplies(prev => ({
        ...prev,
        [originalMessage.id]: false
      }));
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Mensajes</h1>
          <p className="text-gray-600">Gestiona tus conversaciones sobre propiedades</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inbox" className="flex items-center">
              <Inbox className="h-4 w-4 mr-2" />
              Bandeja de Entrada ({inboxMessages.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Mensajes Enviados ({sentMessages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            {inboxMessages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes mensajes recibidos
                  </h3>
                  <p className="text-gray-500">
                    Los mensajes que recibas de otros usuarios aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              inboxMessages.map((message) => (
                <MessageCard 
                  key={message.id} 
                  message={message} 
                  type="inbox"
                  replyText={replyTexts[message.id] || ''}
                  onReplyTextChange={(value) => handleReplyTextChange(message.id, value)}
                  onSendReply={() => handleSendReply(message)}
                  isSendingReply={sendingReplies[message.id] || false}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentMessages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No has enviado mensajes
                  </h3>
                  <p className="text-gray-500">
                    Los mensajes que envíes aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              sentMessages.map((message) => (
                <MessageCard 
                  key={message.id} 
                  message={message} 
                  type="sent"
                  replyText=""
                  onReplyTextChange={() => {}}
                  onSendReply={() => {}}
                  isSendingReply={false}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Messages;
