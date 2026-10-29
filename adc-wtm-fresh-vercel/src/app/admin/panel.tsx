"use client";
import { useState } from "react";
type Item = {id:string;full_name:string;position:string;state:string;effective_date:string;status:string;created_at:string};
export default function AdminPanel() {
  const [token,setToken] = useState("");
  const [items,setItems] = useState<Item[]>([]);
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  async function load() {
    setBusy(true); setMessage("");
    try {
      const r=await fetch("/api/admin/appointments",{headers:{"Authorization":`Bearer ${token}`}});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||"Could not load requests.");
      setItems(d.items||[]); setMessage(`Loaded ${d.items?.length||0} request(s).`);
    } catch(e) {setMessage(e instanceof Error?e.message:"Request failed.");} finally {setBusy(false);}
  }
  async function decide(id:string, action:"approve"|"reject") {
    setBusy(true); setMessage("");
    try {
      const r=await fetch(`/api/admin/appointments/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({action})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||"Update failed.");
      setMessage(action==="approve"?"Approved. You can now download the appointment letter PDF.":"Request rejected.");
      await load();
    } catch(e) {setMessage(e instanceof Error?e.message:"Request failed.");} finally {setBusy(false);}
  }
  return <main className="page"><header className="brand"><div className="mark">ADC</div><div><p className="eyebrow">NATIONAL SECRETARIAT</p><h1>Approval dashboard</h1><p className="muted">Restricted to authorised leadership</p></div></header>
  <section className="panel"><label>Admin access token<input type="password" value={token} onChange={e=>setToken(e.target.value)} autoComplete="current-password" placeholder="Enter ADMIN_ACCESS_TOKEN"/></label><button onClick={load} disabled={busy||!token}>{busy?"Loading…":"Load appointment requests"}</button>{message&&<p role="status">{message}</p>}
  {items.map(item=><article className="request" key={item.id}><div><span className={`status ${item.status}`}>{item.status}</span><h3>{item.full_name}</h3><p>{item.position} — {item.state}</p><small>Effective date: {item.effective_date} · Ref: {item.id}</small></div><div className="actions">{item.status==="pending"&&<><button onClick={()=>decide(item.id,"approve")} disabled={busy}>Approve</button><button className="secondary" onClick={()=>decide(item.id,"reject")} disabled={busy}>Reject</button></>}{item.status==="approved"&&<a className="download" href={`/api/admin/appointments/${item.id}/pdf?token=${encodeURIComponent(token)}`}>Download PDF</a>}</div></article>)}
  <a className="back" href="/">← Back to appointment form</a></section></main>;
}
