// GROUP REPOSITORY IMPLEMENTATION - Hexagonal Architecture
// This file belongs to GROUPS module (Infrastructure - Concrete implementation)

import { GroupRepository, CreateGroupPostData, CreateGroupCommentData, CreateGroupData } from '../../core/domain/repositories/GroupRepository';
import { Group } from '../../core/domain/entities/Group';
import { GroupPost, GroupComment, GroupLike, GroupShare } from '../../core/domain/entities/GroupPost';
import { axiosClient } from '../api/axios-client';
import { GROUP_ENDPOINTS } from '../api/groupEndpoints';

// Concrete repository implementation (Infrastructure)
export class GroupRepositoryImpl implements GroupRepository {
  
  // Groups
  async getGroups(userId?: number): Promise<Group[]> {
    const response = await axiosClient.get(GROUP_ENDPOINTS.BASE);
    return response.data.map((item: any) => this.mapToGroup(item)); // ← arrow function
  }

  async getGroupById(id: number): Promise<Group> {
    const response = await axiosClient.get(`${GROUP_ENDPOINTS.BASE}/${id}`);
    return this.mapToGroup(response.data);
  }

  async createGroup(data: CreateGroupData): Promise<Group> {
    const response = await axiosClient.post(GROUP_ENDPOINTS.CREATE, data);
    return this.mapToGroup(response.data);
  }

  async joinGroup(groupId: number, userId: number): Promise<void> {
    await axiosClient.post(GROUP_ENDPOINTS.JOIN(groupId));
  }

  async leaveGroup(groupId: number, userId: number): Promise<void> {
    console.log('🔍 LEAVE GROUP - Method: DELETE, URL:', GROUP_ENDPOINTS.LEAVE(groupId));
    await axiosClient.delete(GROUP_ENDPOINTS.LEAVE(groupId));
  }
  
  // Publicaciones
  async getGroupPosts(groupId: number, page = 0, size = 20): Promise<{ content: GroupPost[], totalElements: number, totalPages: number }> {
    const response = await axiosClient.get(`${GROUP_ENDPOINTS.POSTS(groupId)}?page=${page}&size=${size}`);
    return {
      content: response.data.content.map((item: any) => this.mapToGroupPost(item)), // ← arrow function
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages
    };
  }

  async createGroupPost(groupId: number, data: CreateGroupPostData): Promise<GroupPost> {
    const endpoint = GROUP_ENDPOINTS.POSTS(groupId);
    const baseURL = axiosClient.defaults.baseURL;
    const fullURL = baseURL + endpoint;
    
    console.log('🚀 GroupRepositoryImpl.createGroupPost:');
    console.log('📍 baseURL:', baseURL);
    console.log('📍 endpoint:', endpoint);
    console.log('📍 FULL URL:', fullURL);
    console.log('📍 Data:', data);
    
    const response = await axiosClient.post(endpoint, data);
    console.log('✅ Post created successfully:', response.data);
    return this.mapToGroupPost(response.data);
  }

  async updateGroupPost(postId: number, data: Partial<CreateGroupPostData>): Promise<GroupPost> {
    const response = await axiosClient.put(GROUP_ENDPOINTS.POST_DETAIL(postId), data);
    return this.mapToGroupPost(response.data);
  }

  async deleteGroupPost(postId: number, userId: number): Promise<void> {
    await axiosClient.delete(GROUP_ENDPOINTS.POST_DETAIL(postId));
  }
  
  // Comentarios
  async getGroupComments(groupId: number, postId: number, page = 0, size = 20): Promise<{ content: GroupComment[], totalElements: number, totalPages: number }> {
    const response = await axiosClient.get(`${GROUP_ENDPOINTS.POSTS(groupId)}/${postId}/comments?page=${page}&size=${size}`);
    return {
      content: response.data.content.map((item: any) => this.mapToGroupComment(item)), // ← arrow function
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages
    };
  }

  async createGroupComment(groupId: number, postId: number, data: CreateGroupCommentData): Promise<GroupComment> {
    const response = await axiosClient.post(GROUP_ENDPOINTS.COMMENTS(groupId, postId), data);
    return this.mapToGroupComment(response.data);
  }

  async deleteGroupComment(commentId: number, userId: number): Promise<void> {
    await axiosClient.delete(GROUP_ENDPOINTS.COMMENT_DETAIL(commentId));
  }
  
  // Interacciones
  async toggleGroupPostLike(postId: number, userId: number): Promise<GroupLike> {
    const response = await axiosClient.post(GROUP_ENDPOINTS.LIKE_POST(postId));
    return this.mapToGroupLike(response.data);
  }

  async toggleGroupCommentLike(commentId: number, userId: number): Promise<GroupLike> {
    const response = await axiosClient.post(GROUP_ENDPOINTS.LIKE_COMMENT(commentId));
    return this.mapToGroupLike(response.data);
  }

  async shareGroupPost(postId: number, userId: number, message?: string): Promise<GroupShare> {
    const endpoint = GROUP_ENDPOINTS.SHARE_POST(postId);
    console.log('Share request details:');
    console.log('  - postId:', postId);
    console.log('  - userId:', userId);
    console.log('  - message:', message);
    console.log('  - endpoint:', endpoint);
    console.log('  - full URL:', `${axiosClient.defaults.baseURL}${endpoint}`);
    
    try {
      // Send share request - backend now allows multiple shares
      console.log('📡 Sending share request...');
      const response = await axiosClient.post(endpoint, message || '', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Share response:', response.data);
      return this.mapToGroupShare(response.data);
    } catch (error: any) {
      console.error('Share error details:');
      console.error('  - message:', error.message);
      console.error('  - status:', error.response?.status);
      console.error('  - statusText:', error.response?.statusText);
      console.error('  - data:', error.response?.data);
      
      // Try alternative format if first attempt fails
      console.log('Trying alternative format with object...');
      try {
        const altResponse = await axiosClient.post(endpoint, { shareMessage: message });
        console.log('Alternative share response:', altResponse.data);
        return this.mapToGroupShare(altResponse.data);
      } catch (altError: any) {
        console.error('Alternative format also failed:', altError.message);
        throw error;
      }
    }
  }
  
  // Images
  async uploadGroupPostImages(postId: number, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await axiosClient.post(GROUP_ENDPOINTS.UPLOAD_IMAGES(postId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteGroupPostImage(imageUrl: string): Promise<void> {
    await axiosClient.delete(GROUP_ENDPOINTS.DELETE_IMAGE, {
      params: { imageUrl }
    });
  }

  // Mappers (API to domain entities conversion)
  private mapToGroup(data: any): Group {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      memberCount: data.memberCount,
      postCount: data.postCount,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      isUserMember: data.isUserMember,
      userRole: data.userRole
    };
  }

  private mapToGroupPost(data: any): GroupPost {
    return {
      id: data.id,
      groupId: data.groupId,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      content: data.content,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      fontStyle: data.fontStyle,
      borderStyle: data.borderStyle,
      postStyle: data.postStyle,
      imageUrls: data.imageUrls || [],
      likeCount: data.likeCount,
      commentCount: data.commentCount,
      shareCount: data.shareCount,
      viewCount: data.viewCount,
      isPinned: data.isPinned,
      isOwn: data.isOwn,
      canEdit: data.canEdit,
      canDelete: data.canDelete,
      hasUserLiked: data.hasUserLiked,
      hasUserShared: data.hasUserShared,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      expiresAt: new Date(data.expiresAt),
      timeAgo: data.timeAgo,
      // Arrow function to avoid losing context
      recentComments: (data.recentComments || []).map((c: any) => this.mapToGroupComment(c))
    };
  }

  private mapToGroupComment(data: any): GroupComment {
    return {
      id: data.id,
      groupPostId: data.groupPostId,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      content: data.content,
      replyToCommentId: data.replyToCommentId,
      replyToUserName: data.replyToUserName,
      replies: (data.replies || []).map((r: any) => this.mapToGroupComment(r)),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      isOwn: data.isOwn,
      canEdit: data.canEdit,
      canDelete: data.canDelete,
      timeAgo: data.timeAgo,
      replyCount: data.replyCount,
      hasUserLiked: data.hasUserLiked,
      likeCount: data.likeCount
    };
  }

  private mapToGroupLike(data: any): GroupLike {
    return {
      id: data.id,
      groupPostId: data.groupPostId,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      createdAt: new Date(data.createdAt),
      isOwn: data.isOwn,
      isCurrentlyActive: data.isCurrentlyActive,
      timeAgo: data.timeAgo
    };
  }

  private mapToGroupShare(data: any): GroupShare {
    return {
      id: data.id,
      groupPostId: data.groupPostId,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      shareMessage: data.shareMessage,
      createdAt: new Date(data.createdAt),
      isOwn: data.isOwn,
      isCurrentlyActive: data.isCurrentlyActive,
      timeAgo: data.timeAgo
    };
  }
}
