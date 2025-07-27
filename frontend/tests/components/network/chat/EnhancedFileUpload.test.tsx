
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EnhancedFileUpload } from '@/components/network/chat/EnhancedFileUpload';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('EnhancedFileUpload', () => {
  const mockOnFileUploaded = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload zone correctly', () => {
    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
    expect(screen.getByText('or click to browse files')).toBeInTheDocument();
    expect(screen.getByText('Maximum file size: 10 MB')).toBeInTheDocument();
  });

  it('shows correct file type badges', () => {
    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('Text files')).toBeInTheDocument();
  });

  it('handles file upload simulation', async () => {
    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    // Wait for upload completion
    await waitFor(() => {
      expect(mockOnFileUploaded).toHaveBeenCalledWith({
        id: expect.any(String),
        url: expect.any(String),
        name: 'test.txt',
        size: file.size,
        type: 'text/plain'
      });
    }, { timeout: 5000 });
  });

  it('validates file size limits', async () => {
    const { toast } = await import('@/hooks/use-toast');
    
    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
        maxSize={1024} // 1KB limit
      />
    );

    const largeFile = new File(['x'.repeat(2048)], 'large.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [largeFile],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Invalid file",
        description: expect.stringContaining("File size exceeds"),
        variant: "destructive",
      });
    });
  });

  it('shows progress during upload', async () => {
    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('allows retry on failed uploads', async () => {
    // Mock a failed upload scenario
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn().mockImplementation(() => {
      throw new Error('Upload failed');
    });

    render(
      <EnhancedFileUpload
        onFileUploaded={mockOnFileUploaded}
        onCancel={mockOnCancel}
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });

    // Restore original implementation for retry
    URL.createObjectURL = originalCreateObjectURL;

    const retryButton = screen.getByLabelText(/retry/i);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(mockOnFileUploaded).toHaveBeenCalled();
    });
  });
});
