export interface Post {
    id: number;
    title: string;
    body: string;
    user_id: number;
    likes: number;
    comments: Comment[];
    userName?: string;
    showCommentBox?: boolean;
  }
  
  export interface Comment {
    id: number;
    postId: number;
    body: string;
    user_id: number;
    userName?: string;
    replies?: Reply[];
    showReplyBox?: boolean;
  }
  
  export interface Reply {
    id: number;
    commentId: number;
    body: string;
    user_id: number;
    userName?: string;
  }