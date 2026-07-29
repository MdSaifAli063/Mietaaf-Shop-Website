import type { SiteSettings } from "@/types";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_EMAIL_DISPLAY,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_E164_DIGITS,
} from "@/lib/site-contact";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandTagline: "Luxury Men’s Ethnic & Formal",
  footerDescription:
    "Crafted silhouettes, ceremonial grandeur, and contemporary tailoring for the modern gentleman.",
  announcementEnabled: true,
  announcementText: "Our Bengaluru studio is open by appointment.",
  announcementMobileText: "Bengaluru studio by appointment.",
  announcementCta: "Book a visit",
  announcementHref: "/appointment",
  supportEmail: SITE_EMAIL_DISPLAY,
  phoneDisplay: SITE_PHONE_DISPLAY,
  whatsappNumber: SITE_WHATSAPP_E164_DIGITS,
  address: SITE_ADDRESS_DISPLAY,
  linkedinUrl: "https://www.linkedin.com/company/mietaaf-couture-llp/",
  instagramUrl: "https://www.instagram.com/mietaaf",
  facebookUrl:
    "https://www.facebook.com/people/Mietaaf-Mietaaf/pfbid02SomQ6rT3aW1ndYNWy6reVSUx9eBKTpfiXibNM3LjLUahjjoAWrwJc6rLuh7qqP8sl/",
};
