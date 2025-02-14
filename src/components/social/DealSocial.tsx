
import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DealSocialProps {
  dealId: string;
  initialLikes?: number;
  initialComments?: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export const DealSocial = ({ dealId, initialLikes = 0, initialComments = [] }: DealSocialProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shareEmail, setShareEmail] = useState('');

  const handleLike = () => {
    setLikes(prev => prev + 1);
    toast.success('Deal liked!');
  };

  const handleComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'Anonymous User',
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added!');
  };

  const handleShare = () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // In a real app, this would send an email through a backend service
    toast.success(`Deal shared with ${shareEmail}`);
    setShareEmail('');
    setShowShareDialog(false);
  };

  const handleReport = () => {
    toast.success('Deal reported. Thank you for helping keep our community safe!');
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLike}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 ml-auto"
          onClick={handleReport}
        >
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{comment.author}</span>
                <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="mt-1">{comment.text}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleComment}>Post</Button>
          </div>
        </div>
      )}

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <Button onClick={handleShare} className="w-full">
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
