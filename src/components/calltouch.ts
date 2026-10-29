declare global {
  interface Window {
    ct?: (...args: unknown[]) => { sessionId?: string } | undefined;
    ym?: (id: number, action: string, target: string) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export function persistUtmParams(search: string = typeof window !== 'undefined' ? window.location.search : ''): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(search);
    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) {
        localStorage.setItem(key, val);
      }
    }
  } catch {
    // ignore storage errors
  }
}

export function getStoredUtmParams(search: string = typeof window !== 'undefined' ? window.location.search : ''): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    let val = params.get(key) || '';
    if (!val && typeof window !== 'undefined') {
      try {
        val = localStorage.getItem(key) || '';
      } catch {
        val = '';
      }
    }
    result[key] = val;
  }
  return result;
}

export function normalizeCalltouchPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return '7' + digits.slice(1);
  }
  if (digits.length === 10) {
    return '7' + digits;
  }
  return digits;
}

export function buildCalltouchParams({
  fio,
  phone,
  subject,
  comment = '',
  tags = '',
  requestUrl = '',
  sessionId = null,
  utm = {},
}: {
  fio: string;
  phone: string;
  subject: string;
  comment?: string;
  tags?: string;
  requestUrl?: string;
  sessionId?: string | null;
  utm?: Record<string, string>;
}): URLSearchParams {
  const utm_source = utm.utm_source || '';
  const utm_medium = utm.utm_medium || '';
  const utm_campaign = utm.utm_campaign || '';
  const utm_content = utm.utm_content || '';
  const utm_term = utm.utm_term || '';

  const utmString = [
    `utm_source=${utm_source}`,
    `utm_medium=${utm_medium}`,
    `utm_campaign=${utm_campaign}`,
    `utm_content=${utm_content}`,
    `utm_term=${utm_term}`,
  ].join('\n');

  const fullComment = `${comment}\n\nUTM:\n${utmString}`.trim();

  const fullTags = [tags, utm_source, utm_medium, utm_campaign]
    .filter(Boolean)
    .join(',');

  const ctData: Record<string, string> = {
    fio: fio || 'Не указано',
    phoneNumber: normalizeCalltouchPhone(phone),
    subject,
    comment: fullComment,
    tags: fullTags,
    requestUrl,
  };

  if (sessionId && sessionId !== 'null' && sessionId !== 'undefined') {
    ctData.sessionId = String(sessionId);
  }

  return new URLSearchParams(ctData);
}

export const sendToCalltouch = async ({
  fio,
  phone,
  subject,
  comment = '',
  tags = '',
}: {
  fio: string;
  phone: string;
  subject: string;
  comment?: string;
  tags?: string;
}): Promise<boolean> => {
  try {
    const ct_site_id = '62069';
    const ct_counter_id = 'ydzahsx0';

    persistUtmParams();
    const utm = getStoredUtmParams();
    const requestUrl =
      typeof window !== 'undefined'
        ? `https://sale.pragmatika-changanauto.ru${window.location.pathname}${window.location.search}`
        : 'https://sale.pragmatika-changanauto.ru/';

    let sessionId: string | null = null;
    try {
      if (typeof window !== 'undefined' && window.ct) {
        const result = window.ct('calltracking_params', ct_counter_id);
        sessionId = result?.sessionId || null;
      }
    } catch (e) {
      console.warn('Calltouch sessionId error:', e);
    }

    const bodyParams = buildCalltouchParams({
      fio,
      phone,
      subject,
      comment,
      tags,
      requestUrl,
      sessionId,
      utm,
    });

    const response = await fetch(
      `https://api.calltouch.ru/calls-service/RestAPI/requests/${ct_site_id}/register/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      }
    );

    return response.ok;
  } catch (err) {
    console.warn('Calltouch error:', err);
    return false;
  }
};
