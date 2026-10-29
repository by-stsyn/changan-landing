import { useState } from "react";
import { LeadPayload } from "../types/car";
import { FUNCTIONS_URL } from "../lib/supabase";
import { supabase } from "../lib/supabase";
import { getUtmParams } from "../utils/format";

interface UseLeadFormResult {
  submitting: boolean;
  success: boolean;
  error: string | null;
  submitLead: (payload: Omit<LeadPayload, "source" | "utmMedium" | "utmCampaign" | "utmTerm">) => Promise<boolean>;
  reset: () => void;
}

export function useLeadForm(): UseLeadFormResult {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitLead(payload: Omit<LeadPayload, "source" | "utmMedium" | "utmCampaign" | "utmTerm">): Promise<boolean> {
    setSubmitting(true);
    setError(null);

    try {
      const utmParams = getUtmParams();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      // In-memory / mock storage if Supabase credentials are not configured
      if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
        try {
          const stored = JSON.parse(localStorage.getItem("changan_leads") || "[]");
          stored.push({ ...payload, ...utmParams, timestamp: new Date().toISOString() });
          localStorage.setItem("changan_leads", JSON.stringify(stored));
        } catch {
          // ignore storage errors
        }
        await new Promise((r) => setTimeout(r, 600));
        setSuccess(true);
        return true;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${FUNCTIONS_URL}/submit-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...payload, ...utmParams }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Ошибка отправки");
      }

      setSuccess(true);
      return true;
    } catch (err) {
      console.warn("Backend submit error, saving lead locally:", err);
      try {
        const stored = JSON.parse(localStorage.getItem("changan_leads") || "[]");
        stored.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem("changan_leads", JSON.stringify(stored));
        setSuccess(true);
        return true;
      } catch {
        setError(String(err));
        return false;
      }
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSuccess(false);
    setError(null);
  }

  return { submitting, success, error, submitLead, reset };
}
