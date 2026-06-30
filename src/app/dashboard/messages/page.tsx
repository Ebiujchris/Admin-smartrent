'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Check, CornerDownRight, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin.service';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getMessages({ unreadOnly: filterUnread });
      setMessages(res.messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterUnread]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminService.markMessageAsRead(id);
      fetchMessages(); // Refresh to update unread status
    } catch (error) {
      console.error("Failed to mark message as read", error);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyContent[messageId]?.trim()) return;

    try {
      await adminService.replyToMessage(messageId, replyContent[messageId]);
      setReplyContent({ ...replyContent, [messageId]: '' });
      setReplyingTo(null);
      fetchMessages(); // Refresh to show reply
    } catch (error) {
      console.error("Failed to send reply", error);
      alert("Failed to send reply");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Support Messages</h1>
          <p className="text-muted-foreground">Manage and reply to inquiries from users.</p>
        </div>
        <Button 
          variant={filterUnread ? "default" : "outline"} 
          className={filterUnread ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}
          onClick={() => setFilterUnread(!filterUnread)}
        >
          {filterUnread ? "Showing Unread" : "Show Unread Only"}
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse bg-card/50 rounded-xl border border-border/50">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card/50 rounded-xl border border-border/50">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={`bg-card/50 backdrop-blur-xl border ${msg.isRead ? 'border-border/50' : 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${msg.isRead ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {msg.sender.fullName}
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{msg.sender.role}</span>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">{msg.subject || 'No Subject'} • {new Date(msg.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                {!msg.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(msg.id)} className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">
                    <Check className="h-4 w-4 mr-1" /> Mark Read
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-background/50 rounded-lg text-sm text-foreground whitespace-pre-wrap border border-border/50">
                  {msg.content}
                </div>

                {/* Replies Thread */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-8 border-l-2 border-border/50">
                    {msg.replies.map((reply: any) => (
                      <div key={reply.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> {reply.sender.fullName} (Admin)
                          </span>
                          <span className="text-[10px] text-muted-foreground">{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-foreground">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                {replyingTo === msg.id ? (
                  <div className="w-full flex gap-2 items-start mt-2">
                    <CornerDownRight className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1 space-y-2">
                      <textarea 
                        className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                        placeholder="Write your reply..."
                        value={replyContent[msg.id] || ''}
                        onChange={(e) => setReplyContent({...replyContent, [msg.id]: e.target.value})}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleReply(msg.id)}>Send Reply</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(msg.id)} className="ml-auto mt-2">
                    <CornerDownRight className="h-4 w-4 mr-2" /> Reply
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
