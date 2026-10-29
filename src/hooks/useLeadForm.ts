import { useState } from "react";
import { LeadPayload } from "../types/car";
import { submitApplication } from "../utils/submitLead";

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
      const ok = await submitApplication({
        name: payload.name,
        phone: payload.phone,
        formType: payload.formType,
        subject: `🔔 Changan Купчино | ${payload.formType || "Новая заявка с сайта"}`,
        calltouchSubject: `Changan Купчино | ${payload.formType || "Заявка с сайта"}`,
        calltouchComment: `Форма: ${payload.formType} | ${payload.carTitle || ""} | ${payload.carId || ""}`,
        calltouchTags: ["changan_kupchino", payload.formType, payload.carId].filter(Boolean).join(","),
        carTitle: payload.carTitle,
        carId: payload.carId,
      });

      if (ok) {
        setSuccess(true);
        return true;
      }
      setError("Ошибка отправки");
      return false;
    } catch (err) {
      setError(String(err));
      return false;
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
