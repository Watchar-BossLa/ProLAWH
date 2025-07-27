
import { useState, useCallback } from 'react';

export function useChatState() {
  const [message, setMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);

  const handleTyping = useCallback((value: string) => {
    setMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  }, [isTyping]);

  const clearMessage = useCallback(() => {
    setMessage('');
    setReplyToMessage(null);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
  }, []);

  const toggleFileUpload = useCallback(() => {
    setShowFileUpload(prev => !prev);
  }, []);

  const handleReply = useCallback((msg: any) => {
    setReplyToMessage(msg);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyToMessage(null);
  }, []);

  return {
    message,
    setMessage,
    showSearch,
    showFileUpload,
    isTyping,
    replyToMessage,
    handleTyping,
    clearMessage,
    toggleSearch,
    toggleFileUpload,
    handleReply,
    cancelReply
  };
}
