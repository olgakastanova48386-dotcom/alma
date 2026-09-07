"use client";

import { useEffect, useRef, useState } from "react";

type Stop={id:number;name:string;lat:number;lng:number};
type LeafletMap={remove:()=>void;fitBounds:(bounds:unknown,options?:unknown)=>void};
type Leaflet={map:(el:HTMLElement,options?:unknown)=>LeafletMap;tileLayer:(url:string,options?:unknown)=>{addTo:(map:LeafletMap)=>unknown};marker:(coords:[number,number],options?:unknown)=>{addTo:(map:LeafletMap)=>{bindPopup:(html:string)=>unknown}};divIcon:(options:unknown)=>unknown;polyline:(coords:[number,number][],options?:unknown)=>{addTo:(map:LeafletMap)=>{getBounds:()=>unknown}}};
declare global{interface Window{L?:Leaflet}}

export default function SurpriseRouteMap({stops}:{stops:Stop[]}){
 const ref=useRef<HTMLDivElement>(null);const mapRef=useRef<LeafletMap|null>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{if(window.L){queueMicrotask(()=>setReady(true));return;}const css=document.createElement("link");css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(css);const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=()=>setReady(true);document.body.appendChild(script);},[]);
 useEffect(()=>{if(!ready||!ref.current||!window.L||!stops.length)return;mapRef.current?.remove();const L=window.L;const map=L.map(ref.current,{zoomControl:true});mapRef.current=map;L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);const coords=stops.map(s=>[s.lat,s.lng] as [number,number]);stops.forEach((s,i)=>L.marker([s.lat,s.lng],{icon:L.divIcon({className:"",html:`<div style=\"width:34px;height:34px;border-radius:999px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;border:3px solid #fff;box-shadow:0 4px 14px #0003\">${i+1}</div>`,iconSize:[34,34],iconAnchor:[17,17]})}).addTo(map).bindPopup(`<strong>${i+1}. ${s.name}</strong>`));const line=L.polyline(coords,{weight:5,opacity:.85}).addTo(map);map.fitBounds(line.getBounds(),{padding:[45,45]});return()=>{map.remove();mapRef.current=null;};},[ready,stops]);
 return <div className="relative overflow-hidden rounded-[34px] border border-black/5 bg-[#ded8ce]"><div ref={ref} className="h-[360px] sm:h-[460px] w-full"/><div className="pointer-events-none absolute left-5 top-5 z-[500] max-w-[270px] rounded-[22px] bg-white/95 p-4 shadow-lg backdrop-blur"><p className="text-[10px] uppercase tracking-[.18em] text-neutral-400">Маршрут ALMA</p><p className="mt-1 text-sm font-semibold">{stops.length} остановки · Петербург</p><p className="mt-1 text-xs leading-5 text-neutral-500">Точки маршрута показаны прямо на карте ALMA.</p></div></div>;
}
