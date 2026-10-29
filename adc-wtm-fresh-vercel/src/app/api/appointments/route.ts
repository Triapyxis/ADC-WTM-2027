import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { cleanText, type AppointmentInput } from "@/lib/appointment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input: AppointmentInput = {
      fullName: cleanText(body.fullName,120),
      position: cleanText(body.position,120),
      state: cleanText(body.state,100),
      effectiveDate: cleanText(body.effectiveDate,10),
      responsibilities: cleanText(body.responsibilities,5000),
      email: cleanText(body.email,254),
      phone: cleanText(body.phone,40)
    };
    if (!input.fullName || !input.position || !input.state || !input.effectiveDate || !input.responsibilities) {
      return NextResponse.json({error:"Please complete all required fields."},{status:400});
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.effectiveDate)) {
      return NextResponse.json({error:"Enter a valid effective date."},{status:400});
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("appointments").insert({
      full_name:input.fullName, position:input.position, state:input.state,
      effective_date:input.effectiveDate, responsibilities:input.responsibilities,
      email:input.email || null, phone:input.phone || null, status:"pending"
    }).select("id").single();
    if (error) throw error;
    return NextResponse.json({id:data.id,status:"pending"},{status:201});
  } catch (error) {
    console.error("Appointment submission failed:", error);
    return NextResponse.json({error:"Unable to submit. Check Supabase configuration and database schema."},{status:500});
  }
}
