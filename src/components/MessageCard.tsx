
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, Reply, Send, MessageCircle, User, Circle, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface MessageDetail {
  id: string;
  body: string;
  sent_at: string;
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
  unread_count?: number;
  last_message_read?: boolean;
}

interface MessageCardProps {
  thread: MessageThread;
  type: 'inbox' | 'sent';
  replyText: string;
  onReplyTextChange: (value: string) => void;
  onSendReply: () => void;
  isSendingReply: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const MessageCard = ({ 
  thread, 
  type, 
  replyText, 
  onReplyTextChange, 
  onSendReply, 
  isSendingReply,
  isExpanded,
  onToggleExpanded
}: MessageCardProps) => {
  const navigate = useNavigate();

  const sortedMessages = [...thread.messages].sort(
    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
  );

  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const hasUnreadMessages = thread.unread_count && thread.unread_count > 0;

  // Function to get message status icon
  const getMessageStatusIcon = (message: MessageDetail, isCurrentUser: boolean) => {
    if (!isCurrentUser) return null;
    
    if (message.read_at) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    } else {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow ${hasUnreadMessages ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-600" />
              <Button
                variant="link"
                className="p-0 h-auto text-lg font-semibold text-blue-600 hover:text-blue-800"
                onClick={() => navigate(`/property/${thread.listing_id}`)}
              >
                {thread.property_title}
              </Button>
              {hasUnreadMessages && (
                <Circle className="h-2 w-2 text-red-500 fill-current ml-2" />
              )}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{thread.property_location}</p>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="h-3 w-3 mr-1" />
              {type === 'inbox' ? (
                <span className="font-medium">Mensaje de: {thread.other_user_name}</span>
              ) : (
                <span className="font-medium">Para: {thread.other_user_name}</span>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Calendar className="h-3 w-3 mr-1" />
              Último mensaje: {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
            </div>

            {thread.availability && type === 'inbox' && (
              <div className="bg-blue-50 p-2 rounded-md text-sm mb-2">
                <span className="font-medium text-blue-800">Disponibilidad del propietario:</span>
                <p className="text-blue-700 mt-1">{thread.availability}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={type === 'inbox' ? 'default' : 'secondary'}>
                {type === 'inbox' ? 'Recibido' : 'Enviado'}
              </Badge>
              {hasUnreadMessages && (
                <Badge variant="destructive" className="text-xs">
                  {thread.unread_count} nuevo{thread.unread_count! > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {thread.messages.length} mensaje{thread.messages.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Thread preview or expanded view */}
        {!isExpanded ? (
          <div className={`border-l-4 ${hasUnreadMessages ? 'border-blue-500' : 'border-gray-200'} pl-4`}>
            <div className="flex items-start justify-between">
              <p className={`text-gray-700 whitespace-pre-wrap mb-2 line-clamp-2 flex-1 ${hasUnreadMessages ? 'font-medium' : ''}`}>
                {latestMessage.body}
              </p>
              {type === 'sent' && getMessageStatusIcon(latestMessage, true)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpanded}
              className="flex items-center"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ver conversación completa ({thread.messages.length} mensajes)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Full conversation thread */}
            <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {sortedMessages.map((message) => {
                const isFromOtherUser = message.from_user_id === thread.other_user_id;
                const isFromCurrentUser = !isFromOtherUser;
                const isUnread = !message.read_at && isFromOtherUser;
                
                return (
                  <div 
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      isFromOtherUser 
                        ? `bg-white border-l-4 ${isUnread ? 'border-blue-500 shadow-sm' : 'border-blue-500'}` 
                        : 'bg-blue-100 ml-8 border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium text-gray-700 ${isUnread ? 'text-blue-700' : ''}`}>
                        {isFromOtherUser ? thread.other_user_name : 'Yo'}
                        {isUnread && (
                          <Circle className="inline h-2 w-2 text-blue-500 fill-current ml-1" />
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.sent_at), 'dd/MM/yyyy HH:mm')}
                        </span>
                        {getMessageStatusIcon(message, isFromCurrentUser)}
                      </div>
                    </div>
                    <p className={`text-gray-700 whitespace-pre-wrap text-sm ${isUnread ? 'font-medium' : ''}`}>
                      {message.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpanded}
              className="mb-3"
            >
              Ocultar conversación
            </Button>

            {/* Reply section - only for inbox messages */}
            {type === 'inbox' && (
              <div className="border-t pt-4">
                <div className="flex items-center mb-3">
                  <Reply className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-700">Responder</span>
                </div>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={onSendReply}
                    disabled={isSendingReply || !replyText.trim()}
                    className="flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSendingReply ? 'Enviando...' : 'Enviar Respuesta'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageCard;
