import { PageEnter } from "@/components/motion/page-enter";
import { PAGE_CONTAINER, PAGE_PY } from "@/lib/layout";

export default function PrivacyPage() {
  return (
    <PageEnter>
      <article className={`${PAGE_CONTAINER} ${PAGE_PY} mx-auto max-w-3xl min-w-0`}>
        <h1 className="font-heading text-3xl sm:text-4xl">Privacy policy</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Mietaaf collects information you provide during checkout, account creation, and
            concierge conversations. We use this data to fulfill orders, improve service, and
            comply with law.
          </p>
          <p>
            WhatsApp messages are governed by Meta’s policies in addition to our internal handling
            standards. Do not share payment card numbers in chat; our team will guide you to
            secure options.
          </p>
          <p>
            You may request access or deletion of personal data by emailing care@mietaaf.com with
            the subject line “Data request”.
          </p>
        </div>
      </article>
    </PageEnter>
  );
}
