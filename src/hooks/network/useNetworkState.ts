
import { useReducer, useCallback } from 'react';
import { NetworkConnection } from '@/types/network';

interface NetworkState {
  connections: NetworkConnection[];
  selectedConnectionId: string | null;
  activeChatId: string | null;
  isSearchExpanded: boolean;
  searchQuery: string;
  filterType: string;
  selectedIndustry: string | null;
}

type NetworkAction =
  | { type: 'SET_CONNECTIONS'; payload: NetworkConnection[] }
  | { type: 'SELECT_CONNECTION'; payload: string | null }
  | { type: 'OPEN_CHAT'; payload: string }
  | { type: 'CLOSE_CHAT' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_TYPE'; payload: string }
  | { type: 'SET_SELECTED_INDUSTRY'; payload: string | null };

const initialState: NetworkState = {
  connections: [],
  selectedConnectionId: null,
  activeChatId: null,
  isSearchExpanded: false,
  searchQuery: '',
  filterType: 'all',
  selectedIndustry: null,
};

function networkReducer(state: NetworkState, action: NetworkAction): NetworkState {
  switch (action.type) {
    case 'SET_CONNECTIONS':
      return { ...state, connections: action.payload };
    case 'SELECT_CONNECTION':
      return { ...state, selectedConnectionId: action.payload };
    case 'OPEN_CHAT':
      return { ...state, activeChatId: action.payload };
    case 'CLOSE_CHAT':
      return { ...state, activeChatId: null };
    case 'TOGGLE_SEARCH':
      return { ...state, isSearchExpanded: !state.isSearchExpanded };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload };
    case 'SET_SELECTED_INDUSTRY':
      return { ...state, selectedIndustry: action.payload };
    default:
      return state;
  }
}

export function useNetworkState() {
  const [state, dispatch] = useReducer(networkReducer, initialState);

  const actions = {
    setConnections: useCallback((connections: NetworkConnection[]) => {
      dispatch({ type: 'SET_CONNECTIONS', payload: connections });
    }, []),
    
    selectConnection: useCallback((id: string | null) => {
      dispatch({ type: 'SELECT_CONNECTION', payload: id });
    }, []),
    
    openChat: useCallback((id: string) => {
      dispatch({ type: 'OPEN_CHAT', payload: id });
    }, []),
    
    closeChat: useCallback(() => {
      dispatch({ type: 'CLOSE_CHAT' });
    }, []),
    
    toggleSearch: useCallback(() => {
      dispatch({ type: 'TOGGLE_SEARCH' });
    }, []),
    
    setSearchQuery: useCallback((query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    }, []),
    
    setFilterType: useCallback((filter: string) => {
      dispatch({ type: 'SET_FILTER_TYPE', payload: filter });
    }, []),
    
    setSelectedIndustry: useCallback((industry: string | null) => {
      dispatch({ type: 'SET_SELECTED_INDUSTRY', payload: industry });
    }, []),
  };

  return { state, actions };
}
