
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, Reply, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  body: string;
  sent_at: string;
  listing_id: string;
  from_user_id: string;
  to_user_id: string;
}

interface MessageCardProps {
  message: Message;
  type: 'inbox' | 'sent';
  replyText: string;
  onReplyTextChange: (value: string) => void;
  onSendReply: () => void;
  isSendingReply: boolean;
}

const MessageCard = ({ 
  message, 
  type, 
  replyText, 
  onReplyTextChange, 
  onSendReply, 
  isSendingReply 
}: MessageCardProps) => {
  const navigate = useNavigate();

  return (
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
                Propiedad {message.listing_id.slice(0, 8)}
              </Button>
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              {type === 'inbox' ? (
                <>
                  <span className="font-medium">De: {message.from_user_id.slice(0, 8)}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">Para: {message.to_user_id.slice(0, 8)}</span>
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
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{message.body}</p>
        
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
      </CardContent>
    </Card>
  );
};

export default MessageCard;
