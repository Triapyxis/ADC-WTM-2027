"use client";

import { useState } from "react";

function nigeriaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

const defaultResponsibilities = `1. Providing strategic leadership and effective supervision of all ADC-WTM activities and structures within the assigned State.
2. Mobilizing members, supporters, and relevant stakeholders at the grassroots level to expand and strengthen the organization's presence throughout the State.
3. Maintaining effective coordination with the National Secretariat and ensuring timely, accurate, and consistent communication between the State and national structures.
4. Promoting unity, discipline, cooperation, accountability, and teamwork among State executives, members, and supporters.
5. Representing the interests, policies, and values of ADC-WTM within the assigned State with loyalty, integrity, professionalism, and diligence.
6. Advancing the objectives, programs, policies, and collective mission of the ADC We-Together Movement across the State.
7. Submitting periodic reports on activities, progress, challenges, and organizational development of the State structure to the National Secretariat.`;

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({fullName:"",position:"State Director",state:"",effectiveDate:nigeriaToday(),responsibilities:defaultResponsibilities,email:"",phone:""});
  const update = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm({...form,[e.target.name]:e.target.value});
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/appointments", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");
      setMessage(`Submitted successfully. Reference: ${data.id}. The appointment letter is pending National Coordinator approval.`);
      setForm({...form,fullName:"",email:"",phone:""});
    } catch (err) { setMessage(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <main className="page">
    <header className="brand"><div className="mark">ADC</div><div><p className="eyebrow">AFRICAN DEMOCRATIC CONGRESS</p><h1>We-Together Movement</h1><p className="muted">Appointment Letter Portal</p></div></header>
    <section className="intro"><span className="pill">National Secretariat</span><h2>Appointment request</h2><p>Complete the details below. Each request is submitted for approval before an official appointment letter is issued.</p></section>
    <form className="panel" onSubmit={submit}>
      <div className="grid">
        <label>Full name *<input name="fullName" value={form.fullName} onChange={update} required maxLength={120} placeholder="Appointee's full name"/></label>
        <label>Position *<input name="position" value={form.position} onChange={update} required maxLength={120} placeholder="e.g. State Director"/></label>
        <label>State / jurisdiction *<input name="state" value={form.state} onChange={update} required maxLength={100} placeholder="e.g. Sokoto State"/></label>
        <label>Appointment effective date *<input type="date" name="effectiveDate" value={form.effectiveDate} onChange={update} required/></label>
        <label>Email address<input type="email" name="email" value={form.email} onChange={update} maxLength={254} placeholder="Optional"/></label>
        <label>Phone number<input name="phone" value={form.phone} onChange={update} maxLength={40} placeholder="Optional"/></label>
      </div>
      <label>Responsibilities *<textarea name="responsibilities" value={form.responsibilities} onChange={update} required rows={8}/></label>
      <p className="notice">The effective date defaults to today in Nigeria (Africa/Lagos time). Confirm the date before submitting. A submitted request is not an approved appointment.</p>
      <button disabled={busy}>{busy ? "Submitting…" : "Submit for approval"}</button>
      {message && <p role="status" className={message.startsWith("Submitted") ? "success" : "error"}>{message}</p>}
    </form>
    <footer>“We Rise, We Shine Together.” <span>•</span> ADC-WTM</footer>
  </main>;
}
