export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const email = String(query.email || "").trim().toLowerCase();
  const token = String(query.token || "");

  const valid = Boolean(email) && verifyUnsubscribeToken(email, token);

  if (valid) {
    await supabaseAdmin()
      .from("subscribers")
      .update({ status: "unsubscribed" })
      .eq("email", email);
  }

  setResponseHeader(event, "Content-Type", "text/html");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#0a0a0a;color:#ffffff;font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
    <div>
      <h1 style="font-size:28px;font-weight:900;text-transform:uppercase;font-style:italic;margin:0 0 12px;">
        ${valid ? "You're Out." : "Link Invalid."}
      </h1>
      <p style="color:#999999;font-size:14px;">
        ${valid ? "You won't hear from the Circuit again. You can always rejoin at rungorun.store." : "This unsubscribe link is invalid or expired."}
      </p>
    </div>
  </body>
</html>`;
});
