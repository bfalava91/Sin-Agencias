
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Inbox, Calendar, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  body: string;
  sent_at: string;
  listing_id: string;
  from_user_id: string;
  to_user_id: string;
  sender_name?: string;
  recipient_name?: string;
  listing_title?: string;
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch inbox messages (messages received by the current user)
      const { data: inboxData, error: inboxError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_from_user_id_fkey(full_name),
          listing:listings!messages_listing_id_fkey(id, property_type, bedrooms, neighborhood, town, postcode)
        `)
        .eq('to_user_id', user.id)
        .order('sent_at', { ascending: false });

      if (inboxError) {
        console.error('Error fetching inbox messages:', inboxError);
      } else {
        const transformedInbox = inboxData?.map(msg => ({
          ...msg,
          sender_name: msg.sender?.full_name || 'Usuario desconocido',
          listing_title: generateListingTitle(msg.listing)
        })) || [];
        setInboxMessages(transformedInbox);
      }

      // Fetch sent messages (messages sent by the current user)
      const { data: sentData, error: sentError } = await supabase
        .from('messages')
        .select(`
          *,
          recipient:profiles!messages_to_user_id_fkey(full_name),
          listing:listings!messages_listing_id_fkey(id, property_type, bedrooms, neighborhood, town, postcode)
        `)
        .eq('from_user_id', user.id)
        .order('sent_at', { ascending: false });

      if (sentError) {
        console.error('Error fetching sent messages:', sentError);
      } else {
        const transformedSent = sentData?.map(msg => ({
          ...msg,
          recipient_name: msg.recipient?.full_name || 'Usuario desconocido',
          listing_title: generateListingTitle(msg.listing)
        })) || [];
        setSentMessages(transformedSent);
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateListingTitle = (listing: any) => {
    if (!listing) return 'Propiedad no disponible';
    
    const propertyType = getDisplayPropertyType(listing.property_type);
    const bedrooms = listing.bedrooms ? `${listing.bedrooms} hab.` : '';
    
    let location = '';
    if (listing.neighborhood) {
      location = listing.neighborhood;
    } else if (listing.town) {
      location = listing.town;
    } else if (listing.postcode) {
      location = listing.postcode;
    }
    
    let title = propertyType;
    if (bedrooms) {
      title += ` ${bedrooms}`;
    }
    if (location) {
      title += ` en ${location}`;
    }
    
    return title;
  };

  const getDisplayPropertyType = (dbType: string) => {
    const displayMapping: { [key: string]: string } = {
      'studio': 'Estudio',
      'bedsit': 'Estudio',
      'flat': 'Piso',
      'penthouse': 'Ático',
      'maisonette': 'Dúplex',
      'detached': 'Casa Individual',
      'semi-detached': 'Casa Adosada',
      'terraced': 'Casa en Hilera',
      'bungalow': 'Bungalow'
    };
    return displayMapping[dbType] || 'Propiedad';
  };

  const MessageCard = ({ message, type }: { message: Message; type: 'inbox' | 'sent' }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-600" />
              <Button
                variant="link"
                className="p-0 h-auto text-lg font-semibold text-blue-600 hover:text-blue-800"
                onClick={() => navigate(`/property/${message.listing_id}`)}
              >
                {message.listing_title}
              </Button>
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              {type === 'inbox' ? (
                <>
                  <span className="font-medium">De: {message.sender_name}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">Para: {message.recipient_name}</span>
                </>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
            </div>
          </div>
          <Badge variant={type === 'inbox' ? 'default' : 'secondary'}>
            {type === 'inbox' ? 'Recibido' : 'Enviado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
      </CardContent>
    </Card>
  );

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

        <Tabs defaultValue="inbox" className="w-full">
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
                <MessageCard key={message.id} message={message} type="inbox" />
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
                <MessageCard key={message.id} message={message} type="sent" />
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
