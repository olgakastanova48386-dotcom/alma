import { Suspense, type ReactNode } from "react";

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-10">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
            <div className="min-h-[560px] lg:min-h-[760px] rounded-[28px] bg-[#ebe8e3] border border-black/5 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto w-10 h-10 rounded-full border-2 border-black/15 border-t-black animate-spin" />
                <p className="mt-4 text-sm text-neutral-500">Загружаем карту…</p>
              </div>
            </div>
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
