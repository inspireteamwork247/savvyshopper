
import { apiRequest } from './apiClient';

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
    const { count } = await apiRequest<{ count: number }>(`social/deals/${dealId}/likes/count`);
    return count;
  },

  async toggleLike(dealId: string): Promise<void> {
    await apiRequest<void>(`social/deals/${dealId}/likes/toggle`, 'POST');
  },

  async getComments(dealId: string): Promise<Comment[]> {
    return await apiRequest<Comment[]>(`social/deals/${dealId}/comments`);
  },

  async addComment(dealId: string, content: string): Promise<void> {
    await apiRequest<void>(`social/deals/${dealId}/comments`, 'POST', { content });
  },

  async reportDeal(dealId: string, reason: string): Promise<void> {
    await apiRequest<void>(`social/deals/${dealId}/report`, 'POST', { reason });
  },

  async shareDeal(dealId: string, email: string): Promise<void> {
    await apiRequest<void>(`social/deals/${dealId}/share`, 'POST', { email });
  }
};
