
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MessageThread } from '@/components/network/chat/MessageThread';
import { ChatMessage } from '@/hooks/useRealtimeChat';

describe('MessageThread', () => {
  const mockParentMessage: ChatMessage = {
    id: 'parent-1',
    content: 'Parent message',
    sender_id: 'user-1',
    sender_name: 'John Doe',
    timestamp: new Date().toISOString(),
    type: 'text',
    reactions: {}
  };

  const mockReplies: ChatMessage[] = [
    {
      id: 'reply-1',
      content: 'First reply',
      sender_id: 'user-2',
      sender_name: 'Jane Smith',
      timestamp: new Date().toISOString(),
      type: 'text',
      reactions: {},
      reply_to: 'parent-1'
    },
    {
      id: 'reply-2',
      content: 'Second reply',
      sender_id: 'user-1',
      sender_name: 'John Doe',
      timestamp: new Date().toISOString(),
      type: 'text',
      reactions: {},
      reply_to: 'parent-1'
    }
  ];

  const mockOnToggleExpanded = vi.fn();
  const mockOnReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders thread toggle with reply count', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={mockReplies}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    expect(screen.getByText('2 replies')).toBeInTheDocument();
  });

  it('shows single reply text for one reply', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={[mockReplies[0]]}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    expect(screen.getByText('1 reply')).toBeInTheDocument();
  });

  it('expands and shows replies when clicked', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={mockReplies}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    expect(screen.getByText('First reply')).toBeInTheDocument();
    expect(screen.getByText('Second reply')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls onToggleExpanded when thread toggle is clicked', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={mockReplies}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    fireEvent.click(screen.getByText('2 replies'));
    expect(mockOnToggleExpanded).toHaveBeenCalledTimes(1);
  });

  it('calls onReply when reply button is clicked', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={mockReplies}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    fireEvent.click(screen.getByText('Reply'));
    expect(mockOnReply).toHaveBeenCalledWith('parent-1');
  });

  it('shows "You" badge for current user messages', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={mockReplies}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    // Should show "You" badge for the second reply (from user-1)
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows reply button when no replies exist', () => {
    render(
      <MessageThread
        parentMessage={mockParentMessage}
        replies={[]}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onReply={mockOnReply}
        currentUserId="user-1"
      />
    );

    expect(screen.getByText('Reply')).toBeInTheDocument();
  });
});
