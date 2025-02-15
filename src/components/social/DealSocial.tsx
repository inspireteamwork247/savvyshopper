
import React, { useState, useEffect } from 'react';
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
import { socialApi, Comment } from '@/services/socialApi';

interface DealSocialProps {
  dealId: string;
}

export const DealSocial = ({ dealId }: DealSocialProps) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLikes();
    if (showComments) {
      loadComments();
    }
  }, [dealId, showComments]);

  const loadLikes = async () => {
    try {
      const count = await socialApi.getLikes(dealId);
      setLikes(count);
    } catch (error) {
      console.error('Error loading likes:', error);
      toast.error('Failed to load likes');
    }
  };

  const loadComments = async () => {
    try {
      const loadedComments = await socialApi.getComments(dealId);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleLike = async () => {
    try {
      setIsLoading(true);
      await socialApi.toggleLike(dealId);
      await loadLikes();
      toast.success('Like updated!');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      await socialApi.addComment(dealId, newComment.trim());
      await loadComments();
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);
      await socialApi.shareDeal(dealId, shareEmail.trim());
      toast.success(`Deal shared with ${shareEmail}`);
      setShareEmail('');
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing deal:', error);
      toast.error('Failed to share deal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      setIsLoading(true);
      await socialApi.reportDeal(dealId, 'inappropriate content');
      toast.success('Deal reported. Thank you for helping keep our community safe!');
    } catch (error) {
      console.error('Error reporting deal:', error);
      toast.error('Failed to report deal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLike}
          disabled={isLoading}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
          disabled={isLoading}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowShareDialog(true)}
          disabled={isLoading}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 ml-auto"
          onClick={handleReport}
          disabled={isLoading}
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
                <span>{comment.user?.username || 'Anonymous'}</span>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleComment} disabled={isLoading}>
              Post
            </Button>
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
              disabled={isLoading}
            />
            <Button 
              onClick={handleShare} 
              className="w-full"
              disabled={isLoading}
            >
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
