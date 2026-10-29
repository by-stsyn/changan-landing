import { sendToCalltouch, getStoredUtmParams, persistUtmParams } from "../components/calltouch";
import { FUNCTIONS_URL, supabase } from "../lib/supabase";

export interface SubmitApplicationParams {
  name?: string;
  phone: string;
  formType: string;
  subject: string;
  calltouchSubject: string;
  calltouchComment: string;
  calltouchTags: string;
  carTitle?: string;
  carId?: string;
  extraFields?: Record<string, string>;
}

export async function submitApplication(params: SubmitApplicationParams): Promise<boolean> {
  const {
    name = "",
    phone,
    formType,
    subject,
    calltouchSubject,
    calltouchComment,
    calltouchTags,
    carTitle = "",
    carId = "",
    extraFields = {},
  } = params;

  persistUtmParams();
  const utm = getStoredUtmParams();

  // Save backup record locally
  try {
    const stored = JSON.parse(localStorage.getItem("changan_leads") || "[]");
    stored.push({
      name: name || "Не указано",
      phone,
      formType,
      carTitle,
      carId,
      ...extraFields,
      ...utm,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("changan_leads", JSON.stringify(stored));
  } catch {
    // ignore storage errors
  }

  // 1. Calltouch submission
  const calltouchPromise = sendToCalltouch({
    fio: name || "Не указано",
    phone,
    subject: calltouchSubject,
    comment: calltouchComment,
    tags: calltouchTags,
  });

  // 2. Web3Forms submission
  const web3FormsPromise = (async (): Promise<boolean> => {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject,
          from_name: "Сайт Changan Купчино",
          "Тип формы": formType,
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          ...(carTitle ? { "Интересующий автомобиль": carTitle } : {}),
          ...(carId ? { "ID автомобиля": carId } : {}),
          ...extraFields,
          ...(utm.utm_source ? { "UTM Source": utm.utm_source } : {}),
          ...(utm.utm_medium ? { "UTM Medium": utm.utm_medium } : {}),
          ...(utm.utm_campaign ? { "UTM Campaign": utm.utm_campaign } : {}),
          ...(utm.utm_term ? { "UTM Term": utm.utm_term } : {}),
          "Страница заявки": typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      return response.ok || response.status === 200;
    } catch {
      return false;
    }
  })();

  // 3. Optional Supabase Edge Function submission if configured
  const supabasePromise = (async (): Promise<boolean> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      return false;
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${FUNCTIONS_URL}/submit-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name || "Не указано",
          phone,
          carTitle,
          carId,
          formType,
          source: utm.utm_source || "direct",
          utmMedium: utm.utm_medium || "",
          utmCampaign: utm.utm_campaign || "",
          utmTerm: utm.utm_term || "",
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  })();

  const [ctResult, w3Result, sbResult] = await Promise.all([
    calltouchPromise,
    web3FormsPromise,
    supabasePromise,
  ]);

  const delivered = ctResult || w3Result || sbResult;

  if (delivered) {
    if (typeof window !== "undefined" && window.ym) {
      try {
        window.ym(108557355, "reachGoal", "forma");
      } catch {
        // ignore analytics error
      }
    }
    return true;
  }

  return false;
}
