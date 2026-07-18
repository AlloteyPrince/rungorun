export const requireAdmin = async (event) => {
  const authHeader = getHeader(event, "authorization") || "";
  const accessToken = authHeader.replace("Bearer ", "");

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: "Missing auth token" });
  }

  const { data, error } = await supabaseAdmin().auth.getUser(accessToken);

  if (error || !data?.user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid session" });
  }

  return data.user;
};
