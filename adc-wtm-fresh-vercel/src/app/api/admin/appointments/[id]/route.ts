import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
export async function PATCH(req:Request, context:{params:Promise<{id:string}>}) {
  const expected=process.env.ADMIN_ACCESS_TOKEN;
  if(!expected || req.headers.get("authorization")!==`Bearer ${expected}`) return NextResponse.json({error:"Unauthorised."},{status:401});
  try {
    const {id}=await context.params;
    const body=await req.json();
    if(!["approve","reject"].includes(body.action)) return NextResponse.json({error:"Invalid action."},{status:400});
    const status=body.action==="approve"?"approved":"rejected";
    const {data,error}=await getSupabaseAdmin().from("appointments").update({status,reviewed_at:new Date().toISOString()}).eq("id",id).eq("status","pending").select("id").maybeSingle();
    if(error) throw error;
    if(!data) return NextResponse.json({error:"Request not found or already reviewed."},{status:409});
    return NextResponse.json({id,status});
  } catch(e) {console.error(e);return NextResponse.json({error:"Unable to update request."},{status:500});}
}
