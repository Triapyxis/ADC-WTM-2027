import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
function authorised(req:Request) {
  const expected=process.env.ADMIN_ACCESS_TOKEN;
  return !!expected && req.headers.get("authorization")==`Bearer ${expected}`;
}
export async function GET(req:Request) {
  if(!authorised(req)) return NextResponse.json({error:"Unauthorised."},{status:401});
  try {
    const {data,error}=await getSupabaseAdmin().from("appointments").select("id,full_name,position,state,effective_date,status,created_at").order("created_at",{ascending:false}).limit(100);
    if(error) throw error;
    return NextResponse.json({items:data});
  } catch(e) { console.error(e); return NextResponse.json({error:"Unable to load requests."},{status:500}); }
}
