export const emailShell = ({ bodyHtml, unsubscribeUrl }) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="text-align:center;margin-bottom:32px;">
        <span style="font-weight:900;font-style:italic;font-size:22px;letter-spacing:-0.02em;text-transform:uppercase;color:#ffffff;">
          Run<span style="color:#dfff00;">Go</span>Run
        </span>
      </div>
      <div style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;color:#e5e5e5;">
        ${bodyHtml}
      </div>
      <div style="text-align:center;margin-top:32px;color:#666666;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">
        <p style="margin:0 0 8px;">Run Go Run &middot; Accra, Ghana</p>
        ${unsubscribeUrl ? `<p style="margin:0;"><a href="${unsubscribeUrl}" style="color:#666666;">Unsubscribe</a></p>` : ""}
      </div>
    </div>
  </body>
</html>
`;
