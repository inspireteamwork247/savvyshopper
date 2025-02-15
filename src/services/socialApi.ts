
import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  deal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
  } | null;
}

export interface Like {
  id: string;
  deal_id: string;
  user_id: string;
  created_at: string;
}

export const socialApi = {
  async getLikes(dealId: string): Promise<number> {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('deal_id', dealId);
    
    return count || 0;
  },

  async toggleLike(dealId: string): Promise<void> {
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('deal_id', dealId)
      .single();

    if (existingLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('deal_id', dealId);
    } else {
      await supabase
        .from('likes')
        .insert([{ deal_id: dealId }]);
    }
  },

  async getComments(dealId: string): Promise<Comment[]> {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(username)
      `)
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  async addComment(dealId: string, content: string): Promise<void> {
    await supabase
      .from('comments')
      .insert([{
        deal_id: dealId,
        content
      }]);
  },

  async reportDeal(dealId: string, reason: string): Promise<void> {
    await supabase
      .from('reports')
      .insert([{
        deal_id: dealId,
        reason
      }]);
  },

  async shareDeal(dealId: string, email: string): Promise<void> {
    // In a real implementation, this would trigger a serverless function
    // to send an email. For now, we'll just log it.
    console.log(`Sharing deal ${dealId} with ${email}`);
  }
};
