"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
function visitorId(){
 let id=localStorage.getItem("alma_visitor_id");
 if(!id){id=crypto.randomUUID();localStorage.setItem("alma_visitor_id",id)}
 return id;
}
export default function PageViewTracker(){
 const pathname=usePathname();
 useEffect(()=>{
  if(!pathname||pathname.startsWith("/admin"))return;
  fetch("/api/analytics/pageview",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({path:pathname,visitorId:visitorId()}),keepalive:true}).catch(()=>{});
 },[pathname]);
 return null;
}