// =============================================================================
// ThreadsResource — Domain-Scoped Contextual Messaging
// =============================================================================

import type { HttpClient } from '../http';
import type {
  ThreadChannel,
  CreateThreadChannelRequest,
  UpdateThreadChannelRequest,
  ThreadChannelEscalationConfig,
  Thread,
  ThreadWithParticipants,
  CreateThreadRequest,
  UpdateThreadRequest,
  ThreadListParams,
  ThreadMessage,
  SendThreadMessageRequest,
  SendSystemMessageRequest,
  ThreadParticipant,
  ThreadReadState,
  MarkReadRequest,
  ThreadInboxItem,
  ThreadInboxParams,
  ThreadFlag,
  FlagMessageRequest,
  ReviewFlagRequest,
  AdminEscalateRequest,
  EntityEventRequest,
  EntityEventResponse,
} from '@caldera/platformxe-types';

export class ThreadsResource {
  constructor(private http: HttpClient) {}

  // -- Channels --

  /** Create a messaging channel */
  async createChannel(input: CreateThreadChannelRequest): Promise<ThreadChannel> {
    return this.http.post<ThreadChannel>('/api/v1/threads/channels', input);
  }

  /** List all channels for the organization */
  async listChannels(): Promise<{ channels: ThreadChannel[] }> {
    return this.http.get<{ channels: ThreadChannel[] }>('/api/v1/threads/channels');
  }

  /** Update a channel */
  async updateChannel(channelId: string, input: UpdateThreadChannelRequest): Promise<ThreadChannel> {
    return this.http.patch<ThreadChannel>(`/api/v1/threads/channels/${channelId}`, input);
  }

  /** Get escalation config for a channel */
  async getEscalationConfig(channelId: string): Promise<{ escalationConfig: ThreadChannelEscalationConfig | null }> {
    return this.http.get<{ escalationConfig: ThreadChannelEscalationConfig | null }>(`/api/v1/threads/channels/${channelId}/escalation`);
  }

  /** Set escalation config for a channel */
  async setEscalationConfig(channelId: string, config: ThreadChannelEscalationConfig): Promise<{ escalationConfig: ThreadChannelEscalationConfig }> {
    return this.http.put<{ escalationConfig: ThreadChannelEscalationConfig }>(`/api/v1/threads/channels/${channelId}/escalation`, config);
  }

  // -- Threads --

  /** Create a thread */
  async createThread(input: CreateThreadRequest): Promise<ThreadWithParticipants> {
    return this.http.post<ThreadWithParticipants>('/api/v1/threads', input);
  }

  /** List threads with optional filters */
  async listThreads(params?: ThreadListParams): Promise<{ threads: Thread[]; total: number }> {
    return this.http.get<{ threads: Thread[]; total: number }>(
      '/api/v1/threads',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Get a single thread by ID */
  async getThread(threadId: string): Promise<ThreadWithParticipants> {
    return this.http.get<ThreadWithParticipants>(`/api/v1/threads/${threadId}`);
  }

  /** Update a thread */
  async updateThread(threadId: string, input: UpdateThreadRequest): Promise<Thread> {
    return this.http.patch<Thread>(`/api/v1/threads/${threadId}`, input);
  }

  /** Close a thread */
  async closeThread(threadId: string, input?: { reason?: string }): Promise<Thread> {
    return this.http.post<Thread>(`/api/v1/threads/${threadId}/close`, input ?? {});
  }

  /** Reopen a closed thread */
  async reopenThread(threadId: string): Promise<Thread> {
    return this.http.post<Thread>(`/api/v1/threads/${threadId}/reopen`, {});
  }

  // -- Messages --

  /** Send a message in a thread */
  async sendMessage(threadId: string, input: SendThreadMessageRequest): Promise<ThreadMessage> {
    return this.http.post<ThreadMessage>(`/api/v1/threads/${threadId}/messages`, input);
  }

  /** List messages in a thread */
  async listMessages(
    threadId: string,
    params?: { role?: string; page?: number; limit?: number },
  ): Promise<{ messages: ThreadMessage[]; total: number }> {
    return this.http.get<{ messages: ThreadMessage[]; total: number }>(
      `/api/v1/threads/${threadId}/messages`,
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Edit a message */
  async editMessage(messageId: string, input: { content: string }): Promise<ThreadMessage> {
    return this.http.patch<ThreadMessage>(`/api/v1/threads/messages/${messageId}`, input);
  }

  /** Soft-delete a message */
  async deleteMessage(messageId: string): Promise<{ deleted: boolean }> {
    return this.http.del<{ deleted: boolean }>(`/api/v1/threads/messages/${messageId}`);
  }

  /** Send a system message */
  async sendSystemMessage(threadId: string, input: SendSystemMessageRequest): Promise<ThreadMessage> {
    return this.http.post<ThreadMessage>(`/api/v1/threads/${threadId}/messages/system`, input);
  }

  // -- Participants --

  /** Add a participant to a thread */
  async addParticipant(
    threadId: string,
    input: { role: string; externalId: string; displayName: string; avatarUrl?: string },
  ): Promise<ThreadParticipant> {
    return this.http.post<ThreadParticipant>(`/api/v1/threads/${threadId}/participants`, input);
  }

  /** Remove a participant from a thread */
  async removeParticipant(threadId: string, participantId: string): Promise<{ removed: boolean }> {
    return this.http.del<{ removed: boolean }>(`/api/v1/threads/${threadId}/participants/${participantId}`);
  }

  /** Update a participant */
  async updateParticipant(
    threadId: string,
    participantId: string,
    input: { displayName?: string; avatarUrl?: string | null; isMuted?: boolean },
  ): Promise<ThreadParticipant> {
    return this.http.patch<ThreadParticipant>(
      `/api/v1/threads/${threadId}/participants/${participantId}`,
      input,
    );
  }

  // -- Read State --

  /** Mark messages as read */
  async markRead(threadId: string, input: MarkReadRequest): Promise<ThreadReadState> {
    return this.http.post<ThreadReadState>(`/api/v1/threads/${threadId}/read`, input);
  }

  /** Get read states for all participants in a thread */
  async getReadStates(threadId: string): Promise<{ readStates: ThreadReadState[] }> {
    return this.http.get<{ readStates: ThreadReadState[] }>(`/api/v1/threads/${threadId}/read-state`);
  }

  // -- Inbox --

  /** Get inbox for a participant */
  async inbox(params: ThreadInboxParams): Promise<{ items: ThreadInboxItem[]; total: number }> {
    return this.http.get<{ items: ThreadInboxItem[]; total: number }>(
      '/api/v1/threads/inbox',
      params as unknown as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Get unread count for a participant */
  async unreadCount(params: { externalId: string; role: string }): Promise<{ count: number }> {
    return this.http.get<{ count: number }>('/api/v1/threads/inbox/unread-count', params);
  }

  // -- Lifecycle --

  /** Notify threads of an entity lifecycle event */
  async entityEvent(input: EntityEventRequest): Promise<EntityEventResponse> {
    return this.http.post<EntityEventResponse>('/api/v1/threads/entity-event', input);
  }

  // -- Flags & Escalation --

  /** Flag a message */
  async flagMessage(
    threadId: string,
    messageId: string,
    input: FlagMessageRequest,
  ): Promise<{ flag: ThreadFlag }> {
    return this.http.post<{ flag: ThreadFlag }>(
      `/api/v1/threads/${threadId}/messages/${messageId}/flag`,
      input,
    );
  }

  /** List flags for a thread */
  async listFlags(
    threadId: string,
    params?: { status?: string; page?: number; limit?: number },
  ): Promise<{ flags: ThreadFlag[]; total: number }> {
    return this.http.get<{ flags: ThreadFlag[]; total: number }>(
      `/api/v1/threads/${threadId}/flags`,
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** List flags across all threads */
  async listFlagsAcrossThreads(
    params?: { status?: string; channelSlug?: string; page?: number; limit?: number },
  ): Promise<{ flags: ThreadFlag[]; total: number }> {
    return this.http.get<{ flags: ThreadFlag[]; total: number }>(
      '/api/v1/threads/flags',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Review a flag */
  async reviewFlag(flagId: string, input: ReviewFlagRequest): Promise<ThreadFlag> {
    return this.http.patch<ThreadFlag>(`/api/v1/threads/flags/${flagId}`, input);
  }

  /** Escalate a thread */
  async escalateThread(
    threadId: string,
    input: AdminEscalateRequest,
  ): Promise<{ rulesEvaluated: number; rulesMatched: number }> {
    return this.http.post<{ rulesEvaluated: number; rulesMatched: number }>(
      `/api/v1/threads/${threadId}/escalate`,
      input,
    );
  }
}
