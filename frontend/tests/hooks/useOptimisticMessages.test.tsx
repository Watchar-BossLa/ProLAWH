
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useOptimisticMessages } from '@/hooks/useOptimisticMessages';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: vi.fn()
  })
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-1',
      email: 'test@example.com'
    }
  })
}));

describe('useOptimisticMessages', () => {
  const connectionId = 'test-connection';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds optimistic message correctly', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));

    act(() => {
      const optimisticId = result.current.addOptimisticMessage('Test message');
      expect(optimisticId).toBeTruthy();
    });

    expect(result.current.optimisticMessages).toHaveLength(1);
    expect(result.current.optimisticMessages[0]).toMatchObject({
      content: 'Test message',
      sender_id: 'test-user-1',
      sender_name: 'test@example.com',
      type: 'text',
      sending: true
    });
  });

  it('adds optimistic message with file data', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));

    act(() => {
      result.current.addOptimisticMessage(
        'File shared',
        'file',
        { url: 'http://example.com/file.pdf', name: 'document.pdf' }
      );
    });

    expect(result.current.optimisticMessages[0]).toMatchObject({
      content: 'File shared',
      type: 'file',
      file_url: 'http://example.com/file.pdf',
      file_name: 'document.pdf'
    });
  });

  it('marks message as sent and removes from optimistic list', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));
    
    let optimisticId: string;
    act(() => {
      optimisticId = result.current.addOptimisticMessage('Test message')!;
    });

    expect(result.current.optimisticMessages).toHaveLength(1);

    const realMessage = {
      id: 'real-message-1',
      content: 'Test message',
      sender_id: 'test-user-1',
      sender_name: 'test@example.com',
      timestamp: new Date().toISOString(),
      type: 'text' as const,
      reactions: {}
    };

    act(() => {
      result.current.markMessageSent(optimisticId, realMessage);
    });

    expect(result.current.optimisticMessages).toHaveLength(0);
  });

  it('marks message as failed', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));
    
    let optimisticId: string;
    act(() => {
      optimisticId = result.current.addOptimisticMessage('Test message')!;
    });

    act(() => {
      result.current.markMessageFailed(optimisticId);
    });

    expect(result.current.optimisticMessages[0]).toMatchObject({
      sending: false,
      failed: true
    });
  });

  it('retries failed message', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));
    
    let optimisticId: string;
    act(() => {
      optimisticId = result.current.addOptimisticMessage('Test message')!;
    });

    act(() => {
      result.current.markMessageFailed(optimisticId);
    });

    act(() => {
      result.current.retryFailedMessage(optimisticId);
    });

    expect(result.current.optimisticMessages[0]).toMatchObject({
      sending: true,
      failed: false
    });
  });

  it('removes optimistic message', () => {
    const { result } = renderHook(() => useOptimisticMessages(connectionId));
    
    let optimisticId: string;
    act(() => {
      optimisticId = result.current.addOptimisticMessage('Test message')!;
    });

    expect(result.current.optimisticMessages).toHaveLength(1);

    act(() => {
      result.current.removeOptimisticMessage(optimisticId);
    });

    expect(result.current.optimisticMessages).toHaveLength(0);
  });

  it('returns null when no user is authenticated', () => {
    // Mock no user scenario
    vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useOptimisticMessages(connectionId));

    act(() => {
      const optimisticId = result.current.addOptimisticMessage('Test message');
      expect(optimisticId).toBeNull();
    });

    expect(result.current.optimisticMessages).toHaveLength(0);
  });
});
