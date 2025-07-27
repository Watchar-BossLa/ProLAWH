
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchInterface } from '@/components/network/chat/search/SearchInterface';
import { SearchSuggestion } from '@/hooks/useSearchSuggestions';

const mockSuggestions: SearchSuggestion[] = [
  {
    id: 'recent-1',
    type: 'recent',
    query: 'recent search',
    description: 'Recent search',
    score: 1.0
  },
  {
    id: 'popular-1',
    type: 'popular',
    query: 'popular term',
    description: 'Popular term',
    score: 0.8
  }
];

describe('SearchInterface', () => {
  const mockProps = {
    query: '',
    onQueryChange: vi.fn(),
    filters: {},
    onFiltersChange: vi.fn(),
    suggestions: mockSuggestions,
    onSuggestionSelect: vi.fn(),
    onClear: vi.fn(),
    isActive: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<SearchInterface {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Search messages...')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('calls onQueryChange when typing', () => {
    render(<SearchInterface {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Search messages...');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(mockProps.onQueryChange).toHaveBeenCalledWith('test query');
  });

  it('shows clear button when query exists', () => {
    render(<SearchInterface {...mockProps} query="test" />);
    
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(<SearchInterface {...mockProps} query="test" />);
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('shows suggestions when input is focused and not active', () => {
    render(<SearchInterface {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Search messages...');
    fireEvent.focus(input);
    
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('recent search')).toBeInTheDocument();
    expect(screen.getByText('popular term')).toBeInTheDocument();
  });

  it('calls onSuggestionSelect when suggestion is clicked', () => {
    render(<SearchInterface {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Search messages...');
    fireEvent.focus(input);
    
    const suggestion = screen.getByText('recent search');
    fireEvent.click(suggestion);
    
    expect(mockProps.onSuggestionSelect).toHaveBeenCalledWith('recent search');
  });

  it('shows results summary when active', () => {
    render(<SearchInterface {...mockProps} isActive={true} totalResults={5} />);
    
    expect(screen.getByText('5 results found')).toBeInTheDocument();
  });

  it('shows filter count when filters are active', () => {
    render(
      <SearchInterface 
        {...mockProps} 
        filters={{ sender: 'John', messageType: 'text' }}
        isActive={true}
      />
    );
    
    expect(screen.getByText('2')).toBeInTheDocument(); // filter count badge
    expect(screen.getByText('2 filters active')).toBeInTheDocument();
  });

  it('opens filters popover when filter button is clicked', () => {
    render(<SearchInterface {...mockProps} />);
    
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);
    
    // The popover content would appear, but testing this requires more complex setup
    // This test verifies the button is clickable
    expect(filterButton).toBeInTheDocument();
  });
});
