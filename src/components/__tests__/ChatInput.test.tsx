import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '../ChatInput';

describe('ChatInput', () => {
  it('calls onSend with trimmed text on submit', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText('Message');
    fireEvent.change(input, { target: { value: '  hello world  ' } });
    fireEvent.click(screen.getByText('Send'));

    expect(onSend).toHaveBeenCalledWith('hello world');
  });

  it('does not call onSend when input is empty', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    fireEvent.click(screen.getByText('Send'));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not call onSend when input is only whitespace', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText('Message');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Send'));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('clears input after successful send', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText('Message');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(screen.getByText('Send'));

    expect(input).toHaveValue('');
  });

  it('sends message on Enter key', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText('Message');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSend).toHaveBeenCalledWith('hello');
  });

  it('disables input and button when isLoading is true', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isLoading />);

    const input = screen.getByPlaceholderText('Message');
    const button = screen.getByText('Send');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
