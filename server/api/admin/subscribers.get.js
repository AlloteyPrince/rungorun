export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { count, error } = await supabaseAdmin()
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Could not load subscriber count" });
  }

  return { count: count || 0 };
});
