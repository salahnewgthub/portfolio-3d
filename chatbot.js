// Chatbot Widget Module for Portfolio Website
// Floating chat widget with streaming responses

export class ChatWidget {
  constructor(options = {}) {
    this.apiEndpoint = options.apiEndpoint || '/api/chat';
    this.isOpen = false;
    this.messages = [];
    this.isStreaming = false;
    this.messageId = 0;

    this.createWidget();
    this.attachEvents();
    this.addWelcomeMessage();
  }

  createWidget() {
    // Create widget container
    this.widget = document.createElement('div');
    this.widget.id = 'chat-widget';
    this.widget.innerHTML = `
      <button id="chat-toggle" class="chat-toggle" aria-label="Open chat assistant" title="Chat with AI Assistant">
        <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="notification-badge" id="chat-badge" style="display: none;">1</span>
      </button>

      <div id="chat-panel" class="chat-panel" style="display: none;">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
              </svg>
            </div>
            <div class="chat-title">
              <h4>AI Assistant</h4>
              <span class="chat-status">Online</span>
            </div>
          </div>
          <button id="chat-minimize" class="chat-control-btn" aria-label="Minimize chat" title="Minimize">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div id="chat-messages" class="chat-messages" role="log" aria-live="polite"></div>

        <div class="chat-input-area">
          <div class="chat-suggestions" id="chat-suggestions"></div>
          <form id="chat-form" class="chat-form">
            <input
              type="text"
              id="chat-input"
              class="chat-input"
              placeholder="Ask about my projects, skills, or experience..."
              autocomplete="off"
              aria-label="Type your message"
              disabled
            >
            <button type="submit" id="chat-send" class="chat-send-btn" aria-label="Send message" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            <button type="button" id="chat-stop" class="chat-stop-btn" aria-label="Stop generating" style="display: none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="6" width="12" height="12" rx="2"></rect>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(this.widget);

    // Cache elements
    this.toggleBtn = document.getElementById('chat-toggle');
    this.panel = document.getElementById('chat-panel');
    this.messagesContainer = document.getElementById('chat-messages');
    this.form = document.getElementById('chat-form');
    this.input = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send');
    this.stopBtn = document.getElementById('chat-stop');
    this.minimizeBtn = document.getElementById('chat-minimize');
    this.suggestionsContainer = document.getElementById('chat-suggestions');
    this.badge = document.getElementById('chat-badge');
  }

  attachEvents() {
    // Toggle chat panel
    this.toggleBtn.addEventListener('click', () => this.toggle());

    // Minimize
    this.minimizeBtn.addEventListener('click', () => this.close());

    // Form submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Stop generation
    this.stopBtn.addEventListener('click', () => this.stopStreaming());

    // Input enter key
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Focus input when opening
    this.input.addEventListener('focus', () => {
      this.hideBadge();
    });

    // Click outside to close (optional - disabled for floating widget)
    // document.addEventListener('click', (e) => {
    //   if (this.isOpen && !this.widget.contains(e.target)) {
    //     this.close();
    //   }
    // });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.panel.style.display = 'flex';
    this.toggleBtn.classList.add('open');
    this.input.disabled = false;
    this.sendBtn.disabled = false;
    this.input.focus();
    this.hideBadge();
    this.renderSuggestions();
  }

  close() {
    this.isOpen = false;
    this.panel.style.display = 'none';
    this.toggleBtn.classList.remove('open');
  }

  hideBadge() {
    this.badge.style.display = 'none';
  }

  showBadge() {
    if (!this.isOpen) {
      this.badge.style.display = 'flex';
    }
  }

  addWelcomeMessage() {
    const welcomeHtml = `
      <div class="message assistant-message" data-id="welcome">
        <div class="message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text">Hi! I'm Salahuddin's AI assistant. Ask me about his projects, skills, experience, or how to get in touch.</div>
          <div class="message-time">${this.formatTime(new Date())}</div>
        </div>
      </div>
    `;
    this.messagesContainer.innerHTML = welcomeHtml;
    this.scrollToBottom();
  }

  renderSuggestions() {
    const suggestions = [
      'What projects have you built?',
      'What are your main skills?',
      'Tell me about your AI employee',
      'How can I contact you?',
    ];

    this.suggestionsContainer.innerHTML = suggestions
      .map((s) => `<button type="button" class="suggestion-chip" data-suggestion="${this.escapeHtml(s)}">${this.escapeHtml(s)}</button>`)
      .join('');

    this.suggestionsContainer.querySelectorAll('.suggestion-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.input.value = btn.dataset.suggestion;
        this.sendMessage();
      });
    });
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isStreaming) return;

    // Add user message
    this.addMessage('user', text);
    this.input.value = '';
    this.suggestionsContainer.innerHTML = '';

    // Disable input during streaming
    this.input.disabled = true;
    this.sendBtn.style.display = 'none';
    this.stopBtn.style.display = 'flex';
    this.isStreaming = true;

    // Add assistant message placeholder
    const assistantId = this.addMessage('assistant', '', true);
    const assistantBubble = document.querySelector(`[data-id="${assistantId}"] .message-text`);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: this.messages.slice(-6) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        if (!this.isStreaming) break; // User clicked stop

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                assistantBubble.textContent = fullContent;
                this.scrollToBottom();
              }
              if (data.done) {
                this.isStreaming = false;
                break;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      // Update message in history
      this.messages[this.messages.length - 1].content = fullContent;
    } catch (error) {
      console.error('Chat error:', error);
      assistantBubble.textContent = "Sorry, I'm having trouble connecting. Please try again or contact Salahuddin directly via WhatsApp or LinkedIn.";
      this.messages[this.messages.length - 1].content = assistantBubble.textContent;
    } finally {
      this.isStreaming = false;
      this.input.disabled = false;
      this.sendBtn.style.display = 'flex';
      this.stopBtn.style.display = 'none';
      this.input.focus();
      this.scrollToBottom();
    }
  }

  stopStreaming() {
    this.isStreaming = false;
  }

  addMessage(role, content, isStreaming = false) {
    const id = `msg-${++this.messageId}`;
    const time = this.formatTime(new Date());

    const avatarSvg = role === 'assistant'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;

    const html = `
      <div class="message ${role}-message" data-id="${id}">
        <div class="message-avatar">${avatarSvg}</div>
        <div class="message-content">
          <div class="message-text">${this.escapeHtml(content)}</div>
          <div class="message-time">${time}</div>
        </div>
      </div>
    `;

    this.messagesContainer.insertAdjacentHTML('beforeend', html);
    this.scrollToBottom();

    this.messages.push({ role, content, id });

    return id;
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Auto-initialization is handled by index.html to avoid double initialization
// if (typeof window !== 'undefined') {
//   document.addEventListener('DOMContentLoaded', () => {
//     window.chatWidget = new ChatWidget();
//   });
// }