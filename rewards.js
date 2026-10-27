/* Scott's Rewards: Supabase client (publishable key is safe in the browser; data is protected by row-level security) */
window.SCOTTS_SB = supabase.createClient(
  "https://nkfhqroxkguewtemgpfe.supabase.co",
  "sb_publishable_MYpP1tZi5iS2Y8d3y4sgxw__IhOv5Ip",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);
window.scottsDeal = async function () {
  var sb = window.SCOTTS_SB;
  var wk = await sb.rpc("current_week");
  if (wk.error) return null;
  var r = await sb.from("weekly_deals").select("*").eq("week_start", wk.data).maybeSingle();
  return r.data || null;
};
