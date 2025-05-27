
import { renderHook, act } from '@testing-library/react';
import { useMessageSearch } from '@/hooks/useMessageSearch';
import { ChatMessage } from '@/hooks/useRealtimeChat';

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello world, this is a test message',
    sender_id: 'user1',
    sender_name: 'John Doe',
    timestamp: '2024-01-01T10:00:00Z',
    type: 'text',
    reactions: { '👍': ['user2'] }
  },
  {
    id: '2',
    content: 'Another message with different content',
    sender_id: 'user2',
    sender_name: 'Jane Smith',
    timestamp: '2024-01-01T11:00:00Z',
    type: 'text',
    reactions: {}
  },
  {
    id: '3',
    content: 'File attachment message',
    sender_id: 'user1',
    sender_name: 'John Doe',
    timestamp: '2024-01-01T12:00:00Z',
    type: 'file',
    file_name: 'document.pdf',
    reactions: {}
  }
];

describe('useMessageSearch', () => {
  it('should initialize with empty search state', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    expect(result.current.query).toBe('');
    expect(result.current.isSearchActive).toBe(false);
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.highlightedMessages).toEqual(mockMessages);
  });

  it('should update query and activate search', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateQuery('test');
    });

    expect(result.current.query).toBe('test');
    expect(result.current.isSearchActive).toBe(true);
    expect(result.current.searchResults.length).toBeGreaterThan(0);
  });

  it('should filter messages by sender', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateFilters({ sender: 'John' });
      result.current.updateQuery('message');
    });

    expect(result.current.searchResults.every(result => 
      result.message.sender_name.includes('John')
    )).toBe(true);
  });

  it('should filter messages by type', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateFilters({ messageType: 'file' });
      result.current.updateQuery('message');
    });

    expect(result.current.searchResults.every(result => 
      result.message.type === 'file'
    )).toBe(true);
  });

  it('should filter messages with reactions', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateFilters({ hasReactions: true });
      result.current.updateQuery('message');
    });

    expect(result.current.searchResults.every(result => 
      Object.keys(result.message.reactions || {}).length > 0
    )).toBe(true);
  });

  it('should clear search and filters', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateQuery('test');
      result.current.updateFilters({ sender: 'John' });
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.isSearchActive).toBe(false);
    expect(result.current.filters).toEqual({});
  });

  it('should handle fuzzy search correctly', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateQuery('helo'); // intentional typo
    });

    // Fuzzy search should still find "Hello"
    expect(result.current.searchResults.some(result => 
      result.message.content.includes('Hello')
    )).toBe(true);
  });

  it('should include match information in search results', () => {
    const { result } = renderHook(() => useMessageSearch(mockMessages));

    act(() => {
      result.current.updateQuery('world');
    });

    const worldMatch = result.current.searchResults.find(result => 
      result.message.content.includes('world')
    );

    expect(worldMatch).toBeDefined();
    expect(worldMatch?.matches).toBeDefined();
    expect(worldMatch?.score).toBeDefined();
  });
});
