import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSupabaseAdmin } from "@/lib/supabase";
import { appointmentLetter } from "@/lib/appointment";
export const runtime="nodejs";
export async function GET(req:Request, context:{params:Promise<{id:string}>}) {
  const url=new URL(req.url), token=url.searchParams.get("token");
  if(!process.env.ADMIN_ACCESS_TOKEN || token!==process.env.ADMIN_ACCESS_TOKEN) return NextResponse.json({error:"Unauthorised."},{status:401});
  try {
    const {id}=await context.params;
    const {data,error}=await getSupabaseAdmin().from("appointments").select("*").eq("id",id).eq("status","approved").single();
    if(error||!data) return NextResponse.json({error:"Approved appointment not found."},{status:404});
    const text=appointmentLetter({fullName:data.full_name,position:data.position,state:data.state,effectiveDate:data.effective_date,responsibilities:data.responsibilities,email:data.email||"",phone:data.phone||""});
    const pdf=await PDFDocument.create(), page=pdf.addPage([595.28,841.89]);
    const font=await pdf.embedFont(StandardFonts.TimesRoman), bold=await pdf.embedFont(StandardFonts.TimesRomanBold);
    // Optional letterhead: place public/letterhead.jpg or public/letterhead.png in the project.
    let hasLetterhead = false;
    try {
      const jpg = await readFile(path.join(process.cwd(), "public", "letterhead.jpg"));
      const image = await pdf.embedJpg(jpg);
      page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      hasLetterhead = true;
    } catch {
      try {
        const png = await readFile(path.join(process.cwd(), "public", "letterhead.png"));
        const image = await pdf.embedPng(png);
        page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
        hasLetterhead = true;
      } catch { /* Letterhead is optional during initial setup. */ }
    }
    if (!hasLetterhead) {
      page.drawText("ADC WE-TOGETHER MOVEMENT",{x:55,y:785,size:16,font:bold,color:rgb(0.05,0.25,0.18)});
      page.drawLine({start:{x:55,y:770},end:{x:540,y:770},thickness:1,color:rgb(0.75,0.65,0.25)});
    }
    const lines=text.split("\n"); let y=hasLetterhead ? 680 : 742; let currentPage=page;
    for(const line of lines) {
      if(y<55){ currentPage=pdf.addPage([595.28,841.89]); y=785; }
      const isHeading=line===line.toUpperCase() && line.length>3;
      const chunks=line.match(/.{1,88}(?:\s|$)/g)||[line];
      for(const chunk of chunks) { currentPage.drawText(chunk.trim(),{x:55,y,size:isHeading?10.5:10,font:isHeading?bold:font,maxWidth:485}); y-=isHeading?19:15; }
      if(!line.trim()) y-=5;
    }
    const bytes=await pdf.save();
    return new NextResponse(Buffer.from(bytes),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="appointment-${id}.pdf"`,"Cache-Control":"no-store"}});
  } catch(e) {console.error(e);return NextResponse.json({error:"Unable to generate PDF."},{status:500});}
}
