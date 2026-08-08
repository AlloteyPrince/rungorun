export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { count, error } = await supabaseAdmin()
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Could not load subscriber count" });
  }

  const { data: referrals, error: referralError } = await supabaseAdmin()
    .from("subscribers")
    .select("referral_source")
    .eq("status", "active");

  if (referralError) {
    throw createError({ statusCode: 500, statusMessage: "Could not load referral breakdown" });
  }

  const counts = {};
  let unanswered = 0;
  for (const row of referrals || []) {
    if (!row.referral_source) {
      unanswered++;
      continue;
    }
    counts[row.referral_source] = (counts[row.referral_source] || 0) + 1;
  }

  const breakdown = Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return { count: count || 0, breakdown, unanswered };
});
