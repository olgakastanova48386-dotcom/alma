"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function PageViewTracker(){
  const pathname=usePathname();
  useEffect(()=>{
    if(!pathname || pathname.startsWith("/admin")) return;
    fetch("/api/analytics/pageview",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({path:pathname}),keepalive:true}).catch(()=>{});
  },[pathname]);
  return null;
}