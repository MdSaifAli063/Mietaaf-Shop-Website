import { Check, MessageCircle } from "lucide-react";

const steps = ["Shopping bag", "Delivery details", "WhatsApp confirmation"];

export function OrderJourney({ current }: { current: 1 | 2 }) {
  return (
    <ol aria-label="Order progress" className="mb-8 grid grid-cols-3 gap-2 border-b border-border/80 pb-6 sm:mb-10 sm:gap-6">
      {steps.map((label, index) => {
        const step = index + 1;
        const completed = step < current;
        return (
          <li key={label} aria-current={step === current ? "step" : undefined} className={`flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left ${step <= current ? "text-foreground" : "text-muted-foreground"}`}>
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] ${step <= current ? "border-foreground bg-foreground text-background" : "border-border bg-surface-silver"}`}>
              {completed ? <Check className="size-3.5" aria-hidden="true" /> : step === 3 ? <MessageCircle className="size-3.5" aria-hidden="true" /> : `0${step}`}
            </span>
            <span className="text-[9px] font-medium uppercase leading-4 tracking-[0.07em] sm:text-[10px] sm:tracking-[0.12em]">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
