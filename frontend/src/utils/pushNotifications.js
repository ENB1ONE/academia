// Web Push & Notification Helper for FORMCLUB
// Compliant with Apple iOS Safari 16.4+ (PWA Add to Home Screen) & Android Chrome

const PUSH_STORAGE_KEY = 'formclub_push_enabled';
const PUSH_TIME_KEY = 'formclub_push_reminder_time';

export function isPushSupported() {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'Notification' in window;
}

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function getNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

// User-gesture triggered permission request
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    throw new Error('Notificações não são suportadas neste navegador.');
  }

  // iOS Safari requires Add to Home Screen first for Web Push
  if (isIOS() && !isStandalone()) {
    throw new Error('No iPhone/iPad, adicione o FORMCLUB à Tela de Início pelo Safari antes de ativar as notificações.');
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    localStorage.setItem(PUSH_STORAGE_KEY, 'true');
    // Ensure service worker is active
    await registerServiceWorker();
    return true;
  } else {
    localStorage.setItem(PUSH_STORAGE_KEY, 'false');
    return false;
  }
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.warn('[PWA] Service Worker registration failed:', err);
    return null;
  }
}

// Disparar notificação de teste ou lembrete de bem-estar
export async function triggerWellnessNotification({
  title = 'Bem-Estar',
  body = 'Lembre-se de registrar seu bem-estar',
  url = '#/monitoring/wellness'
} = {}) {
  if (!isPushSupported()) return false;

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  const reg = await navigator.serviceWorker.getRegistration();
  const options = {
    body,
    icon: './pwa/icon-192x192.png',
    badge: './pwa/icon-144x144.png',
    tag: 'formclub-wellness-reminder',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url }
  };

  if (reg && 'showNotification' in reg) {
    await reg.showNotification(title, options);
    return true;
  } else {
    // Fallback standard notification
    new Notification(title, options);
    return true;
  }
}

// Checagem proativa diária de lembrete de Bem-Estar
export function initWellnessDailyReminder() {
  if (typeof window === 'undefined') return;

  const checkAndNotify = () => {
    const isEnabled = localStorage.getItem(PUSH_STORAGE_KEY) === 'true';
    if (!isEnabled || Notification.permission !== 'granted') return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastNotified = localStorage.getItem('formclub_wellness_last_notified');

    // Se já notificou hoje, pula
    if (lastNotified === todayStr) return;

    const preferredHour = parseInt(localStorage.getItem(PUSH_TIME_KEY) || '8', 10);
    const currentHour = new Date().getHours();

    // Dispara a partir do horário configurado (padrão 8h da manhã)
    if (currentHour >= preferredHour) {
      triggerWellnessNotification({
        title: 'Bem-Estar',
        body: 'Lembre-se de registrar seu bem-estar',
        url: '#/monitoring/wellness'
      });
      localStorage.setItem('formclub_wellness_last_notified', todayStr);
    }
  };

  // Executa checagem inicial e agenda intervalo a cada 15 minutos
  setTimeout(checkAndNotify, 5000);
  setInterval(checkAndNotify, 15 * 60 * 1000);
}
