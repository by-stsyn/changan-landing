import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFICATION_EMAILS = [
  "call@terravto.ru",
  "a.bliznyukov@terravto.ru",
  "ya.popova@pragmatika-changanauto.ru",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, phone, carTitle, carId, formType, source, utmMedium, utmCampaign, utmTerm } = body;

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: lead, error: dbError } = await supabase
      .from("leads")
      .insert({
        name: name || "",
        phone,
        car_title: carTitle || "",
        car_id: carId || "",
        form_type: formType || "unknown",
        source: source || "",
        utm_medium: utmMedium || "",
        utm_campaign: utmCampaign || "",
        utm_term: utmTerm || "",
      })
      .select()
      .maybeSingle();

    if (dbError) {
      console.error("DB error:", dbError);
    }

    const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    const emailSubject = `Новая заявка — Changan Центр Купчино${carTitle ? ` (${carTitle})` : ""}`;
    const emailBody = `
Новая заявка с лендинга Changan Центр Купчино

Имя: ${name || "Не указано"}
Телефон: ${phone}
Автомобиль: ${carTitle || "Не выбран"}
Форма: ${formType || "—"}
Источник: ${source || "—"}
UTM Medium: ${utmMedium || "—"}
UTM Campaign: ${utmCampaign || "—"}
UTM Term: ${utmTerm || "—"}
Дата/время: ${now} (МСК)
ID заявки: ${lead?.id || "—"}
    `.trim();

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"Changan Купчино" <${gmailUser}>`,
          to: NOTIFICATION_EMAILS.join(", "),
          subject: emailSubject,
          text: emailBody,
        });

        console.log("Email sent successfully");
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    } else {
      console.log("GMAIL credentials not set — email notification skipped");
      console.log("Lead data:", emailBody);
    }

    return new Response(
      JSON.stringify({ success: true, id: lead?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-lead error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
