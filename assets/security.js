/**
 * Anti-Inspect & Client Code Protection Guard
 * Mohd Kashif Ahrari Portfolio
 */
(function () {
  'use strict';

  // 1. Disable Context Menu (Right Click)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showSecurityNotice('🔒 Right-click is disabled to protect source assets.');
  });

  // 2. Intercept DevTools & View Source Keyboard Shortcuts
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice('🔒 Developer Tools shortcut (F12) is disabled.');
      return false;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    // Ctrl+Shift+I (DevTools Inspect)
    // Ctrl+Shift+J (DevTools Console)
    // Ctrl+Shift+C (Inspect Element)
    if (isCtrlOrCmd && isShift && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice('🔒 Element inspection is protected.');
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Page Source)
    if (isCtrlOrCmd && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice('🔒 Source view shortcut (Ctrl+U) is disabled.');
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrCmd && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      e.stopPropagation();
      showSecurityNotice('🔒 Page saving is disabled.');
      return false;
    }
  });

  // 3. Prevent Drag & Drop of Images
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 4. Subtle Glassmorphism Security Toast Notification
  let noticeTimeout = null;
  function showSecurityNotice(message) {
    let toast = document.getElementById('security-toast-guard');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'security-toast-guard';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.zIndex = '999999';
      toast.style.background = 'rgba(11, 30, 51, 0.92)';
      toast.style.backdropFilter = 'blur(16px)';
      toast.style.webkitBackdropFilter = 'blur(16px)';
      toast.style.border = '1px solid rgba(0, 171, 240, 0.4)';
      toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 171, 240, 0.2)';
      toast.style.color = '#e2e8f0';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '12px';
      toast.style.fontFamily = "'Outfit', sans-serif";
      toast.style.fontSize = '14px';
      toast.style.fontWeight = '500';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '10px';
      toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span style="font-size:16px;">🛡️</span><span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    if (noticeTimeout) clearTimeout(noticeTimeout);
    noticeTimeout = setTimeout(function () {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
      }
    }, 2400);
  }

  // 5. Console Security Watermark
  if (window.console) {
    const titleStyle = 'color: #00abf0; font-size: 20px; font-weight: bold; text-shadow: 0 0 8px rgba(0,171,240,0.6);';
    const bodyStyle = 'color: #94a3b8; font-size: 13px;';
    console.log('%c⚡ Mohd Kashif Ahrari — Portfolio Architecture', titleStyle);
    console.log('%c⚠️ Notice: All visual designs, code architecture, and assets are proprietary & protected.', bodyStyle);
  }
})();
