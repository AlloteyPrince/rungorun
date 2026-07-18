const CHUNK_SIZE = 100;

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { subject, message } = await readBody(event);

  if (!subject?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Subject and message are required" });
  }

  const { data: subscribers, error: fetchError } = await supabaseAdmin()
    .from("subscribers")
    .select("email")
    .eq("status", "active");

  if (fetchError) {
    throw createError({ statusCode: 500, statusMessage: "Could not load subscribers" });
  }

  const origin = getRequestURL(event).origin;
  const bodyHtml = message
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  const emails = (subscribers || []).map(({ email }) => {
    const token = signUnsubscribeToken(email);
    const unsubscribeUrl = `${origin}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    return {
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject,
      html: emailShell({ bodyHtml, unsubscribeUrl }),
    };
  });

  let sent = 0;
  for (const batch of chunk(emails, CHUNK_SIZE)) {
    if (batch.length === 0) continue;
    await resend().batch.send(batch);
    sent += batch.length;
  }

  return { sent, total: emails.length };
});
