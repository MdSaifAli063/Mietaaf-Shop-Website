import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageEnter } from "@/components/motion/page-enter";

export default function OrderSuccessPage() {
  return (
    <PageEnter>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
          Thank you
        </p>
        <h1 className="mt-4 font-heading text-4xl">Order sent to WhatsApp</h1>
        <p className="mt-4 text-muted-foreground">
          Complete your conversation with the Mietaaf team in WhatsApp to confirm tailoring,
          timelines, and payment.
        </p>
        <Button asChild className="mt-8 rounded-full px-8">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </PageEnter>
  );
}
