import { SITE_ADDRESS_DISPLAY } from "@/lib/site-contact";

/** First-party answers shared by the visible FAQ, schema, and LLM reference. */
export const BRAND_FAQS = [
  {
    q: "What is Mietaaf Couture?",
    a: "Mietaaf Couture is a menswear house in Bengaluru (Bangalore), offering custom-tailored suits, sherwanis, Indo-Western outfits, wedding wear and formal tailoring, with studio fittings and doorstep consultations.",
  },
  {
    q: "Where is Mietaaf Couture in Bangalore?",
    a: `The studio is at ${SITE_ADDRESS_DISPLAY}. Visits are by appointment. Book a studio visit or contact the team before travelling.`,
  },
  {
    q: "How do I place an order?",
    a: "Choose your pieces and options, add them to your bag, and sign in to complete checkout with your delivery details. Checkout opens WhatsApp with a prepared order message. Send it to the Mietaaf Couture team to confirm availability, fitting details, payment and delivery.",
  },
  {
    q: "Can I book a doorstep tailoring consultation?",
    a: "Yes. Mietaaf Couture offers door-to-door fabric selection, fitting and personal design consultations. Use the appointment page to request a visit; the team confirms your location, availability and service details.",
  },
  {
    q: "Do you accept online card payments on this website?",
    a: "This storefront completes checkout through WhatsApp only. The team confirms the order and shares payment and tailoring options in the conversation.",
  },
  {
    q: "How do I confirm sizing and delivery timelines?",
    a: "Contact the Mietaaf Couture team with your chosen outfit, measurements, delivery location and event date. Fitting requirements, availability and delivery timelines are confirmed for your order before you proceed.",
  },
  {
    q: "What about alterations?",
    a: "Minor alterations guidance is provided remotely; complex fits may be scheduled in-studio. Ask the team about the fitting requirements for your selected piece.",
  },
] as const;
