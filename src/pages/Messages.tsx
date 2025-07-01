
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessageCard from "@/components/MessageCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Inbox, Circle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MessageDetail {
  id: string;
  body: string;
  sent_at: string;
  listing_id: string;
  from_user_id: string;
  to_user_id: string;
  from_user_name?: string;
  to_user_name?: string;
  read_at?: string;
}

interface MessageThread {
  listing_id: string;
  property_title: string;
  property_location: string;
  availability?: string;
  messages: MessageDetail[];
  other_user_id: string;
  other_user_name: string;
  last_message_at: string;
  unread_count: number;
  last_message_read: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [inboxThreads, setInboxThreads] = useState<MessageThread[]>([]);
  const [sentThreads, setSentThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [sendingReplies, setSendingReplies] = useState<{ [key: string]: boolean }>({});
  const [expandedThreads, setExpandedThreads] = useState<{ [key: string]: boolean }>({});
  
  // Get initial tab from URL params or default to 'inbox'
  const initialTab = searchParams.get('tab') === 'sent' ? 'sent' : 'inbox';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchMessageThreads();
    
    // Set up real-time subscriptions
    const messagesChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchMessageThreads();
          
          // Show toast notification for new messages
          if (payload.new.to_user_id === user.id) {
            toast({
              title: "Nuevo mensaje",
              description: "Has recibido un nuevo mensaje.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  // Update active tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sent' || tabParam === 'inbox') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchMessageThreads = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Fetching messages for user:', user.id);

      // Fetch messages with better join structure
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          sent_at,
          listing_id,
          from_user_id,
          to_user_id,
          listings!messages_listing_id_fkey (
            id,
            address_line_2,
            town,
            postcode,
            property_type,
            bedrooms,
            availability
          )
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar los mensajes. Verifica tu conexión a internet.",
          variant: "destructive",
        });
        return;
      }

      console.log('Raw messages data:', messagesData);

      if (!messagesData || messagesData.length === 0) {
        console.log('No messages found');
        setInboxThreads([]);
        setSentThreads([]);
        return;
      }

      // Get unique user IDs to fetch profile names
      const userIds = Array.from(new Set([
        ...messagesData.map(msg => msg.from_user_id),
        ...messagesData.map(msg => msg.to_user_id)
      ]));

      // Fetch user profiles with error handling
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Advertencia",
          description: "Algunos nombres de usuario no se pudieron cargar.",
          variant: "destructive",
        });
      }

      // Create a map of user_id to full_name
      const userNamesMap = new Map();
      (profilesData || []).forEach(profile => {
        userNamesMap.set(profile.user_id, profile.full_name || 'Usuario');
      });

      console.log('User names map:', userNamesMap);

      // Transform messages to include user names
      const transformedMessages: MessageDetail[] = messagesData.map(msg => ({
        id: msg.id,
        body: msg.body,
        sent_at: msg.sent_at,
        listing_id: msg.listing_id,
        from_user_id: msg.from_user_id,
        to_user_id: msg.to_user_id,
        from_user_name: userNamesMap.get(msg.from_user_id) || 'Usuario',
        to_user_name: userNamesMap.get(msg.to_user_id) || 'Usuario',
        listing: msg.listings,
        read_at: null // Will be implemented with read status
      }));

      console.log('Transformed messages:', transformedMessages);

      // Group messages into threads with unread counts
      const inboxThreadsMap = new Map<string, MessageThread>();
      const sentThreadsMap = new Map<string, MessageThread>();

      transformedMessages.forEach(message => {
        const isIncoming = message.to_user_id === user.id;
        const otherUserId = isIncoming ? message.from_user_id : message.to_user_id;
        const threadKey = `${message.listing_id}-${otherUserId}`;
        const listing = (message as any).listing;
        
        const propertyTitle = listing 
          ? `${listing.property_type || 'Propiedad'} ${listing.bedrooms ? `de ${listing.bedrooms} dormitorio${listing.bedrooms > 1 ? 's' : ''}` : ''}, ${listing.town || 'Ubicación'}`.trim()
          : `Propiedad ${message.listing_id.slice(0, 8)}`;
        
        const propertyLocation = listing 
          ? `${listing.address_line_2 || ''} ${listing.town || ''} ${listing.postcode || ''}`.trim()
          : 'Ubicación no disponible';

        const otherUserName = isIncoming ? message.from_user_name : message.to_user_name;

        if (isIncoming) {
          // Inbox thread - messages TO the current user
          if (!inboxThreadsMap.has(threadKey)) {
            inboxThreadsMap.set(threadKey, {
              listing_id: message.listing_id,
              property_title: propertyTitle,
              property_location: propertyLocation,
              availability: listing?.availability,
              messages: [],
              other_user_id: otherUserId,
              other_user_name: otherUserName || 'Usuario',
              last_message_at: message.sent_at,
              unread_count: 0,
              last_message_read: false
            });
          }
          const thread = inboxThreadsMap.get(threadKey)!;
          thread.messages.push(message);
          if (new Date(message.sent_at) > new Date(thread.last_message_at)) {
            thread.last_message_at = message.sent_at;
          }
          // Simulate unread messages (in real implementation, this would be based on read_at field)
          if (!message.read_at) {
            thread.unread_count++;
          }
        } else {
          // Sent thread - messages FROM the current user
          if (!sentThreadsMap.has(threadKey)) {
            sentThreadsMap.set(threadKey, {
              listing_id: message.listing_id,
              property_title: propertyTitle,
              property_location: propertyLocation,
              availability: listing?.availability,
              messages: [],
              other_user_id: otherUserId,
              other_user_name: otherUserName || 'Usuario',
              last_message_at: message.sent_at,
              unread_count: 0,
              last_message_read: true
            });
          }
          const thread = sentThreadsMap.get(threadKey)!;
          thread.messages.push(message);
          if (new Date(message.sent_at) > new Date(thread.last_message_at)) {
            thread.last_message_at = message.sent_at;
          }
        }
      });

      // Convert maps to arrays and sort by last message time
      const inboxArray = Array.from(inboxThreadsMap.values()).sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
      
      const sentArray = Array.from(sentThreadsMap.values()).sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      console.log('Final inbox threads:', inboxArray);
      console.log('Final sent threads:', sentArray);

      setInboxThreads(inboxArray);
      setSentThreads(sentArray);

    } catch (error) {
      console.error('Error fetching message threads:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar los mensajes. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThreadKey = (thread: MessageThread) => {
    return `${thread.listing_id}-${thread.other_user_id}`;
  };

  const handleReplyTextChange = (threadKey: string, value: string) => {
    setReplyTexts(prev => ({
      ...prev,
      [threadKey]: value
    }));
  };

  const handleSendReply = async (thread: MessageThread) => {
    if (!user) return;

    const threadKey = getThreadKey(thread);
    const replyText = replyTexts[threadKey]?.trim();
    
    if (!replyText) {
      toast({
        title: "Campo requerido",
        description: "Por favor, escribe una respuesta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setSendingReplies(prev => ({
      ...prev,
      [threadKey]: true
    }));

    try {
      console.log('Sending reply:', {
        from_user_id: user.id,
        to_user_id: thread.other_user_id,
        listing_id: thread.listing_id,
        body: replyText
      });

      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: thread.other_user_id,
          listing_id: thread.listing_id,
          body: replyText
        });

      if (error) {
        console.error('Error sending reply:', error);
        if (error.code === 'PGRST301') {
          toast({
            title: "Error de permisos",
            description: "No tienes permisos para enviar este mensaje.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error de envío",
            description: "No se pudo enviar la respuesta. Verifica tu conexión.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "¡Mensaje enviado!",
          description: "Tu respuesta ha sido enviada correctamente.",
        });
        
        // Clear the reply text
        setReplyTexts(prev => ({
          ...prev,
          [threadKey]: ''
        }));
        
        // Refresh threads to show the new reply
        fetchMessageThreads();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar la respuesta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSendingReplies(prev => ({
        ...prev,
        [threadKey]: false
      }));
    }
  };

  const handleToggleExpanded = (threadKey: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [threadKey]: !prev[threadKey]
    }));
  };

  // Calculate total unread messages
  const totalUnreadMessages = inboxThreads.reduce((total, thread) => total + thread.unread_count, 0);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            Mis Mensajes
            {totalUnreadMessages > 0 && (
              <span className="ml-3 flex items-center">
                <Circle className="h-3 w-3 text-red-500 fill-current mr-1" />
                <span className="text-sm text-red-600 font-medium">
                  {totalUnreadMessages} nuevo{totalUnreadMessages > 1 ? 's' : ''}
                </span>
              </span>
            )}
          </h1>
          <p className="text-gray-600">Gestiona tus conversaciones sobre propiedades</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inbox" className="flex items-center">
              <Inbox className="h-4 w-4 mr-2" />
              Bandeja de Entrada ({inboxThreads.length})
              {totalUnreadMessages > 0 && (
                <Circle className="h-2 w-2 text-red-500 fill-current ml-2" />
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Mensajes Enviados ({sentThreads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            {inboxThreads.length === 0 ? (
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
              inboxThreads.map((thread) => {
                const threadKey = getThreadKey(thread);
                return (
                  <MessageCard 
                    key={threadKey}
                    thread={thread}
                    type="inbox"
                    replyText={replyTexts[threadKey] || ''}
                    onReplyTextChange={(value) => handleReplyTextChange(threadKey, value)}
                    onSendReply={() => handleSendReply(thread)}
                    isSendingReply={sendingReplies[threadKey] || false}
                    isExpanded={expandedThreads[threadKey] || false}
                    onToggleExpanded={() => handleToggleExpanded(threadKey)}
                  />
                );
              })
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentThreads.length === 0 ? (
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
              sentThreads.map((thread) => {
                const threadKey = getThreadKey(thread);
                return (
                  <MessageCard 
                    key={threadKey}
                    thread={thread}
                    type="sent"
                    replyText=""
                    onReplyTextChange={() => {}}
                    onSendReply={() => {}}
                    isSendingReply={false}
                    isExpanded={expandedThreads[threadKey] || false}
                    onToggleExpanded={() => handleToggleExpanded(threadKey)}
                  />
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Messages;
