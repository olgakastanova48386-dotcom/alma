"use client";

import { useEffect, useRef, useState } from "react";

type AlmaSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function AlmaSelect({
  label,
  value,
  options,
  onChange,
}: AlmaSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative flex-1">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`mt-2 flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition ${open ? "border-black bg-white shadow-[0_12px_35px_rgba(0,0,0,0.10)]" : "border-transparent bg-[#f3f1ed] hover:bg-[#ece8e2]"}`}
      >
        <span>{value}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-40 mt-2 max-h-72 overflow-auto rounded-[20px] border border-black/5 bg-white p-2 shadow-[0_20px_55px_rgba(0,0,0,0.16)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm transition ${selected ? "bg-black font-medium text-white" : "hover:bg-[#f3f1ed]"}`}
              >
                <span>{option}</span>
                {selected && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
