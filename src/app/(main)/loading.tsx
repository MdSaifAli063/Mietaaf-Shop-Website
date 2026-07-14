/** Instant feedback during client navigations — main segment only */
import Image from "next/image";
import { SITE_LOGO_URL } from "@/lib/site-logo";

export default function MainLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4">
      <div className="relative h-[5.5rem] w-[min(calc(100dvw-7rem),340px)] sm:h-[6.5rem] sm:w-[min(calc(100dvw-8rem),420px)] lg:h-[7.5rem] lg:w-[min(44vw,520px)]">
        <Image
          src={SITE_LOGO_URL}
          alt="Mietaaf"
          fill
          priority
          unoptimized
          sizes="(max-width: 480px) 300px, (max-width: 640px) 380px, 520px"
          className="animate-[logo-pop_700ms_ease-out] object-contain drop-shadow-[0_3px_16px_rgba(15,23,42,0.22)]"
        />
      </div>
      <p className="sr-only">Loading…</p>
    </div>
  );
}
