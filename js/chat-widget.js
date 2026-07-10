(() => {
  'use strict';

  const styleId = 'neo-builderbot-style';
  const shadowStyles = `
    .chat-widget-container,
    .dark-mode {
      --chat-white: #ffffff !important;
      --chat-send-button: #1f5eff !important;
      --chat-send-button-hover: #3158ff !important;
      --chat-accent-color: #1f5eff !important;
      --chat-background: rgba(5, 8, 20, 0.97) !important;
      --chat-background-chat: rgba(2, 3, 10, 0.97) !important;
      --chat-input-background: rgba(255, 255, 255, 0.08) !important;
      --chat-border-color: rgba(125, 162, 255, 0.18) !important;
    }

    .chat-widget-container {
      border: 1px solid rgba(125, 162, 255, 0.2) !important;
      box-shadow:
        0 26px 90px rgba(0, 0, 0, 0.48),
        0 22px 76px rgba(31, 94, 255, 0.22) !important;
      backdrop-filter: blur(22px);
    }

    .chat-header,
    .chat-input {
      background: rgba(5, 8, 20, 0.97) !important;
    }

    .input-container {
      border: 1px solid rgba(125, 162, 255, 0.16) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .send-button {
      color: #ffffff !important;
      box-shadow: 0 12px 28px rgba(31, 94, 255, 0.3);
    }

    .selector-btn {
      display: none !important;
    }

    @media (max-width: 768px) {
      .chat-widget-container {
        border-radius: 0 !important;
        border-left: 0 !important;
        border-right: 0 !important;
      }
    }
  `;

  const injectNeoChatStyle = () => {
    document.querySelectorAll('chat-widget-container, chat-widget-button').forEach((widget) => {
      const root = widget.shadowRoot;
      if (!root || root.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = shadowStyles;
      root.appendChild(style);
    });
  };

  injectNeoChatStyle();
  window.addEventListener('load', injectNeoChatStyle, { once: true });

  if ('MutationObserver' in window) {
    const observer = new MutationObserver(injectNeoChatStyle);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.setTimeout(injectNeoChatStyle, 500);
  window.setTimeout(injectNeoChatStyle, 1500);
})();
