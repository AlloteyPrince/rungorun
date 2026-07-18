export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Only send if this email is a genuine active subscriber — stops the
  // endpoint being used to blast arbitrary inboxes with our domain.
  const { data: subscriber } = await supabaseAdmin()
    .from("subscribers")
    .select("email")
    .eq("email", normalizedEmail)
    .eq("status", "active")
    .maybeSingle();

  if (!subscriber) {
    return { sent: false };
  }

  const token = signUnsubscribeToken(normalizedEmail);
  const unsubscribeUrl = `${getRequestURL(event).origin}/api/unsubscribe?email=${encodeURIComponent(normalizedEmail)}&token=${token}`;

  await resend().emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: normalizedEmail,
    subject: "You're In. Welcome To The Circuit.",
    html: emailShell({
      bodyHtml: `
        <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;font-style:italic;color:#ffffff;margin:0 0 16px;">
          Welcome to the <span style="color:#dfff00;">Circuit.</span>
        </h1>
        <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
          You're officially part of the movement. Expect weekly drops, training notes, and community updates — straight from Accra.
        </p>
        <p style="font-size:15px;line-height:1.7;margin:0;">
          Stopping was never an option.
        </p>
      `,
      unsubscribeUrl,
    }),
  });

  return { sent: true };
});
