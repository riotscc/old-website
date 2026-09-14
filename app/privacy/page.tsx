"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Dither from "@/components/Dither/Dither";

const navigation = [
  {
    label: "Scope and Definitions",
    href: "#scope",
  },
  {
    label: "Information We Collect",
    href: "#information",
  },
  {
    label: "Sources of Information",
    href: "#sources",
  },
  {
    label: "How We Use Information",
    href: "#purposes",
  },
  {
    label: "Legal Bases",
    href: "#legal-bases",
  },
  {
    label: "Analytics and Profile Views",
    href: "#analytics",
  },
  {
    label: "Cookies and Sessions",
    href: "#cookies",
  },
  {
    label: "Information Sharing",
    href: "#sharing",
  },
  {
    label: "Data Retention",
    href: "#retention",
  },
  {
    label: "Data Security",
    href: "#security",
  },
  {
    label: "International Transfers",
    href: "#international-transfers",
  },
  {
    label: "EEA, UK and Swiss Users",
    href: "#europe",
  },
  {
    label: "United States Privacy Rights",
    href: "#us-rights",
  },
  {
    label: "Children's Privacy",
    href: "#children",
  },
  {
    label: "Third-Party Services",
    href: "#third-party",
  },
  {
    label: "Changes to This Policy",
    href: "#changes",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <div className="relative">
        <section className="relative h-[378px] overflow-hidden border-b border-white/[0.055] bg-[#050505]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[12%] scale-[1.15]">
              <Dither
                waveColor={[
                  0.01568627450980392,
                  0.0392156862745098,
                  0.5215686274509804,
                ]}
                disableAnimation={false}
                enableMouseInteraction={false}
                mouseRadius={0.3}
                colorNum={4}
                waveAmplitude={0.28}
                waveFrequency={2.7}
                waveSpeed={0.05}
              />
            </div>

            <div className="absolute -inset-[22%] translate-x-[8%] -translate-y-[6%] scale-[1.22] opacity-45">
              <Dither
                waveColor={[
                  0.01568627450980392,
                  0.0392156862745098,
                  0.5215686274509804,
                ]}
                disableAnimation={false}
                enableMouseInteraction={false}
                mouseRadius={0.3}
                colorNum={4}
                waveAmplitude={0.22}
                waveFrequency={3.15}
                waveSpeed={0.035}
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(40,50,249,0.1),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#080808]/10 to-[#080808]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080808]/12 via-transparent to-[#080808]/12" />

          <div className="relative z-10 flex h-full items-center justify-center px-6 pt-[68px]">
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <h1 className="text-[36px] font-semibold tracking-[-1.5px] text-white sm:text-[44px]">
                Privacy Policy
              </h1>

              <p className="mx-auto mt-4 max-w-[670px] text-[12px] leading-6 text-white/42 sm:text-[13px]">
                How carts.lol collects, uses, stores, protects, and shares
                information when you use our website, profiles, dashboard, and
                related services.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="absolute inset-x-0 top-0 z-50">
          <Header />
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1220px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
          <article className="min-w-0">
            <div className="border-b border-white/[0.07] pb-7">
              <p className="text-[12px] text-white/45">
                <span className="font-semibold text-white/70">
                  Last Updated:
                </span>{" "}
                September 14, 2026
              </p>

              <p className="mt-3 text-[11px] italic leading-5 text-white/30">
                This Privacy Policy explains how information is collected,
                processed, used, disclosed, and protected in connection with
                carts.lol. Please review it carefully.
              </p>
            </div>

            <PolicySection id="scope" title="Scope and Definitions">
              <p>
                This Privacy Policy applies to information processed by
                carts.lol when you visit our website, create or manage an
                Account, view or interact with a profile, use the dashboard,
                purchase a paid feature, contact support, or otherwise use
                carts.lol products and services collectively referred to as the
                "Services."
              </p>

              <p>
                This Policy applies to both registered users and visitors where
                information is processed through the Services.
              </p>

              <PrivacyList
                items={[
                  '"Account Data" means information associated with a registered carts.lol account.',
                  '"Profile Data" means information a user chooses to display through a carts.lol profile.',
                  '"Usage Data" means information generated when a person accesses or interacts with the Services.',
                  '"Analytics Data" means information used to provide profile owners with statistics about visits and interactions.',
                  '"Security Data" means technical information processed to protect Accounts, investigate misuse, prevent fraud, enforce restrictions, or secure the Services.',
                  '"Personal Data" or "Personal Information" means information that identifies, relates to, describes, or can reasonably be linked to an individual where applicable law defines it as such.',
                ]}
              />
            </PolicySection>

            <PolicySection
              id="information"
              title="Information We Collect"
            >
              <p>
                The information carts.lol processes depends on how you use the
                Services. Some information is provided directly by you, while
                other information is generated automatically when you access
                carts.lol.
              </p>

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Account and identity information
              </h3>

              <PrivacyList
                items={[
                  "User IDs and internal account identifiers.",
                  "Usernames, display names, and profile names.",
                  "Avatar or profile image information.",
                  "Discord account information when Discord authentication is used.",
                  "Email addresses when provided for login, account security, verification, or support.",
                  "Account plan, subscription status, feature access, and account creation information.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Profile and content information
              </h3>

              <PrivacyList
                items={[
                  "Biography, display text, links, aliases, profile settings, and customization choices.",
                  "Images, files, media, icons, backgrounds, or other content uploaded to the Services.",
                  "Badges, profile configuration, layout preferences, and other public-facing profile settings.",
                  "Metadata associated with content submitted through carts.lol.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Usage and technical information
              </h3>

              <PrivacyList
                items={[
                  "Request timestamps and pages or endpoints accessed.",
                  "Browser and user-agent information.",
                  "Device category such as desktop, mobile, or tablet.",
                  "Referring website or source when provided by the browser.",
                  "General request and response information used to operate and troubleshoot the Services.",
                  "IP address or derived IP-related information where needed for security, analytics, fraud prevention, or abuse detection.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Analytics information
              </h3>

              <PrivacyList
                items={[
                  "Profile views and approximate unique visitor counts.",
                  "Link interactions and clicks where the relevant analytics feature is enabled.",
                  "Visit timestamps and aggregated traffic history.",
                  "Device type and traffic-source information.",
                  "Country or general geographic information derived from request data where available.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Security and abuse-prevention information
              </h3>

              <PrivacyList
                items={[
                  "Authentication activity and session information.",
                  "Rate-limit events and unusual request patterns.",
                  "Identifiers used to prevent repeated artificial profile views or other analytics manipulation.",
                  "Signals used to detect scraping, automated abuse, credential misuse, spam, fraud, or attempts to bypass restrictions.",
                  "Information associated with investigations into suspected violations of our Terms or security incidents.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Payment and support information
              </h3>

              <PrivacyList
                items={[
                  "Purchase status, transaction identifiers, plan information, and billing-related records received from payment providers.",
                  "Messages, attachments, and other information you provide when contacting support.",
                  "Information required to investigate refunds, payment disputes, fraud, or Account ownership.",
                ]}
              />

              <p>
                carts.lol does not need to store full payment card numbers to
                provide normal payment functionality. Card payment details are
                generally handled by the payment provider used during checkout.
              </p>
            </PolicySection>

            <PolicySection id="sources" title="Sources of Information">
              <p>
                We may receive information from several sources depending on the
                features you use.
              </p>

              <PrivacyList
                items={[
                  "Directly from you when you create an Account, edit your profile, upload content, make a purchase, or contact us.",
                  "Automatically from your browser, device, or network when you access or interact with the Services.",
                  "From authentication providers such as Discord when you authorize carts.lol to receive permitted account information.",
                  "From payment processors when they provide payment status, transaction information, or fraud-related results.",
                  "From third-party infrastructure and security providers used to operate, deliver, and protect the Services.",
                ]}
              />
            </PolicySection>

            <PolicySection id="purposes" title="How We Use Information">
              <p>
                carts.lol processes information for purposes related to
                operating, maintaining, protecting, and improving the Services.
              </p>

              <PrivacyList
                items={[
                  "Create and maintain Accounts.",
                  "Authenticate users and maintain login sessions.",
                  "Display and deliver user-created profile pages.",
                  "Store and serve content submitted through the Services.",
                  "Provide analytics such as profile views, link interactions, devices, and traffic sources.",
                  "Process Premium purchases and determine feature access.",
                  "Respond to support requests and Account issues.",
                  "Detect fraud, abuse, scraping, automated traffic, suspicious authentication activity, and attempts to bypass platform restrictions.",
                  "Prevent duplicate or manipulated analytics events where appropriate.",
                  "Monitor service performance and diagnose application or infrastructure failures.",
                  "Protect carts.lol, our users, our infrastructure, and third parties from misuse or security threats.",
                  "Enforce our Terms of Service and other applicable policies.",
                  "Comply with valid legal requirements and protect legal rights.",
                ]}
              />
            </PolicySection>

            <PolicySection id="legal-bases" title="Legal Bases for Processing">
              <p>
                Where the General Data Protection Regulation, United Kingdom
                GDPR, or similar European data protection law applies,
                carts.lol processes Personal Data only when a lawful basis is
                available.
              </p>

              <PrivacyList
                items={[
                  "Performance of a contract when processing is necessary to provide an Account, profile, paid feature, or another Service you requested.",
                  "Legitimate interests when processing is reasonably necessary to secure the Services, prevent fraud, detect abuse, maintain reliability, understand service usage, or protect legal rights, provided those interests are not overridden by your applicable rights.",
                  "Legal obligations when information must be processed or retained to comply with applicable law, valid legal process, accounting obligations, or regulatory requirements.",
                  "Consent when applicable law requires consent for a particular optional feature or processing activity.",
                ]}
              />

              <p>
                Where processing is based on consent, you may withdraw that
                consent at any time. Withdrawal does not affect processing that
                was lawful before consent was withdrawn.
              </p>
            </PolicySection>

            <PolicySection
              id="analytics"
              title="Analytics and Profile Views"
            >
              <p>
                carts.lol may provide profile owners with information about how
                their public profile is being viewed and used. Analytics are
                intended to provide useful traffic information without
                unnecessarily exposing individual visitors to profile owners.
              </p>

              <PrivacyList
                items={[
                  "Profile view counts may be calculated using request information and identifiers designed to reduce duplicate views.",
                  "IP-related information may be hashed or otherwise transformed when used for deduplication, abuse prevention, or security purposes.",
                  "Profile owners may receive aggregated statistics such as view counts, device categories, traffic sources, and general geographic information.",
                  "Raw IP addresses are not intended to be displayed to profile owners through normal analytics features.",
                  "Analytics information may be filtered or adjusted to remove duplicate, automated, fraudulent, or otherwise invalid traffic.",
                ]}
              />

              <p>
                Analytics measurements are estimates and may not always exactly
                represent the number of individual people who viewed or
                interacted with a profile.
              </p>
            </PolicySection>

            <PolicySection id="cookies" title="Cookies and Session Technologies">
              <p>
                carts.lol uses cookies and similar browser storage where
                necessary to provide authentication, maintain sessions, protect
                Accounts, remember relevant preferences, and support reliable
                operation of the Services.
              </p>

              <PrivacyList
                items={[
                  "Session cookies may be used to keep you signed in.",
                  "Authentication-related storage may be used during login and account-linking flows.",
                  "Security-related values may be used to prevent unauthorized requests or repeated abuse.",
                  "Cookies or similar storage may be used to remember necessary application state or preferences.",
                ]}
              />

              <p>
                carts.lol does not need cross-site advertising cookies to
                operate its core profile and dashboard features. If our use of
                cookies changes materially, this Policy may be updated to
                describe that use.
              </p>
            </PolicySection>

            <PolicySection id="sharing" title="Information Sharing and Disclosure">
              <p>
                carts.lol does not sell Personal Data as part of the normal
                operation of the Services. Information may be disclosed when
                reasonably necessary to operate carts.lol or comply with legal
                requirements.
              </p>

              <PrivacyList
                items={[
                  "Infrastructure, hosting, storage, content delivery, monitoring, security, and other service providers that process information on our behalf.",
                  "Authentication providers when necessary to perform a login or connected-account feature.",
                  "Payment processors when needed to complete purchases, prevent payment fraud, or manage transactions.",
                  "Professional advisers such as lawyers, accountants, or security specialists when reasonably necessary.",
                  "Law enforcement, courts, regulators, or other authorities when disclosure is required by applicable law or valid legal process.",
                  "A successor or acquiring entity in connection with a merger, acquisition, restructuring, financing, asset transfer, or similar transaction.",
                ]}
              />

              <p>
                Public profile information is visible to people who access the
                relevant public profile. Users should not publish information
                on a public profile that they do not want others to see.
              </p>
            </PolicySection>

            <PolicySection id="retention" title="Data Retention">
              <p>
                Information is retained for as long as reasonably necessary for
                the purpose for which it was collected, to operate the
                Services, resolve disputes, prevent fraud, enforce agreements,
                maintain security, and comply with applicable legal
                requirements.
              </p>

              <p>
                Retention periods may differ depending on the type of
                information and the reason it is processed.
              </p>

              <PrivacyList
                items={[
                  "Account information may remain while an Account is active.",
                  "Session information may be removed or expire when a session is no longer valid.",
                  "Security and abuse-prevention records may be retained for a reasonable period when needed to investigate or prevent repeated misuse.",
                  "Payment records may be retained as required for accounting, fraud prevention, dispute handling, or legal obligations.",
                  "Backups may temporarily contain deleted information until the relevant backup is rotated or expires.",
                ]}
              />
            </PolicySection>

            <PolicySection id="security" title="Data Security">
              <p>
                carts.lol uses technical and organizational measures intended
                to protect information against unauthorized access, disclosure,
                alteration, loss, or misuse.
              </p>

              <PrivacyList
                items={[
                  "Encrypted transport is used for supported connections to production services.",
                  "Access to internal systems and user information is restricted according to operational need.",
                  "Authentication and authorization controls are used to restrict access to protected functionality.",
                  "Security-related activity may be logged or monitored for investigation.",
                  "Sensitive technical values may be hashed, encrypted, or otherwise protected when appropriate.",
                ]}
              />

              <p>
                No internet service, storage system, or security measure can
                guarantee complete security. Users should also protect their
                Account credentials and notify us if they believe their Account
                has been compromised.
              </p>
            </PolicySection>

            <PolicySection
              id="international-transfers"
              title="International Data Transfers"
            >
              <p>
                carts.lol and the service providers used to operate the
                Services may process information in countries other than the
                country where you live.
              </p>

              <p>
                This means Personal Data may be transferred to jurisdictions
                with privacy laws that differ from those in your country.
              </p>

              <p>
                Where European data protection law requires additional
                safeguards for an international transfer, carts.lol will use an
                applicable lawful transfer mechanism or other recognized
                safeguard where required.
              </p>
            </PolicySection>

            <PolicySection
              id="europe"
              title="EEA, United Kingdom, and Switzerland"
            >
              <p>
                If you are located in the European Economic Area, United
                Kingdom, or Switzerland, applicable data protection law may give
                you additional rights concerning your Personal Data.
              </p>

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Your rights
              </h3>

              <PrivacyList
                items={[
                  "Right of access: you may request confirmation of whether Personal Data about you is being processed and request a copy where applicable.",
                  "Right to rectification: you may request correction of inaccurate or incomplete Personal Data.",
                  "Right to erasure: you may request deletion of Personal Data in circumstances provided by applicable law.",
                  "Right to restriction: you may request that certain processing be limited while an issue concerning the data is reviewed.",
                  "Right to data portability: where applicable, you may request certain Personal Data you provided in a structured, commonly used, machine-readable format.",
                  "Right to object: you may object to certain processing based on legitimate interests where applicable.",
                  "Right to withdraw consent: when processing is based on consent, you may withdraw that consent at any time.",
                  "Right to complain: you may submit a complaint to the data protection authority responsible for your jurisdiction.",
                ]}
              />

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Automated processing
              </h3>

              <p>
                carts.lol may use automated systems to identify suspicious
                requests, duplicate analytics events, unusual authentication
                activity, spam, fraud, or other potential abuse.
              </p>

              <p>
                These systems may generate signals or classifications that help
                determine whether additional security controls, rate limits, or
                review are appropriate. They are used primarily to protect the
                Services and enforce technical restrictions.
              </p>

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                International transfers
              </h3>

              <p>
                Personal Data from the EEA, United Kingdom, or Switzerland may
                be processed outside those regions. When applicable law requires
                safeguards for those transfers, appropriate transfer mechanisms
                will be used.
              </p>

              <h3 className="pt-3 text-[14px] font-semibold text-white/80">
                Exercising your rights
              </h3>

              <p>
                We may need to verify your identity before completing a request
                involving Personal Data. We may also decline or limit a request
                where permitted by law, including when the request would
                adversely affect another person's rights or where retention is
                required by law.
              </p>

              <p>
                Privacy requests can be submitted to{" "}
                <a
                  href="mailto:privacy@carts.lol"
                  className="font-medium text-white/75 transition-colors hover:text-white"
                >
                  privacy@carts.lol
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection
              id="us-rights"
              title="United States Privacy Rights"
            >
              <p>
                Residents of certain U.S. states may have privacy rights under
                state law. The specific rights available depend on your state,
                the nature of the information, and whether the relevant law
                applies to carts.lol.
              </p>

              <PrivacyList
                items={[
                  "The right to request access to certain Personal Information.",
                  "The right to request correction of inaccurate Personal Information.",
                  "The right to request deletion of certain Personal Information.",
                  "The right to obtain certain information in a portable format where applicable.",
                  "The right to opt out of certain types of sale, sharing, targeted advertising, or profiling where applicable.",
                  "The right not to receive unlawful discriminatory treatment for exercising an applicable privacy right.",
                ]}
              />

              <p>
                carts.lol does not sell Personal Information as part of the
                normal operation of its Services and does not use Personal
                Information for cross-context behavioral advertising as a core
                platform function.
              </p>

              <p>
                Where required, an authorized agent may submit a request on your
                behalf. Additional verification may be required before a request
                can be completed.
              </p>
            </PolicySection>

            <PolicySection id="children" title="Children's Privacy">
              <p>
                carts.lol is not intended to knowingly collect Personal Data
                from children who are below the minimum age permitted to use the
                Services under applicable law.
              </p>

              <p>
                If you believe that a child has provided Personal Data to
                carts.lol in a manner that is not permitted by applicable law,
                contact us so the information can be reviewed and appropriate
                action can be taken.
              </p>
            </PolicySection>

            <PolicySection id="third-party" title="Third-Party Services">
              <p>
                carts.lol may rely on or connect to third-party services for
                authentication, payment processing, hosting, content delivery,
                security, or other platform functionality.
              </p>

              <p>
                Public profiles may also contain links selected by individual
                users. carts.lol does not control the privacy practices or
                content of external websites linked by users.
              </p>

              <p>
                When you leave carts.lol or interact directly with another
                provider, that provider's privacy policy may govern its
                collection and use of information.
              </p>
            </PolicySection>

            <PolicySection id="changes" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy when carts.lol changes, when
                new features are introduced, or when legal, technical,
                security, or operational requirements change.
              </p>

              <p>
                The "Last Updated" date at the top of this page identifies the
                most recent revision.
              </p>

              <p>
                If a change materially affects how Personal Data is processed,
                additional notice may be provided where required or
                appropriate.
              </p>
            </PolicySection>

            <PolicySection id="contact" title="Contact">
              <p>
                Privacy questions, Personal Data requests, legal notices, and
                general support inquiries can be sent through the appropriate
                contact below.
              </p>

              <div className="mt-6 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-5">
                <div>
                  <p className="text-[11px] font-medium text-white/35">
                    Privacy requests
                  </p>

                  <a
                    href="mailto:privacy@carts.lol"
                    className="mt-1 inline-block text-[12px] font-semibold text-white/75 transition-colors hover:text-white"
                  >
                    privacy@carts.lol
                  </a>
                </div>

                <div className="mt-5 border-t border-white/[0.06] pt-5">
                  <p className="text-[11px] font-medium text-white/35">
                    Legal notices
                  </p>

                  <a
                    href="mailto:legal@carts.lol"
                    className="mt-1 inline-block text-[12px] font-semibold text-white/75 transition-colors hover:text-white"
                  >
                    legal@carts.lol
                  </a>
                </div>

                <div className="mt-5 border-t border-white/[0.06] pt-5">
                  <p className="text-[11px] font-medium text-white/35">
                    Support
                  </p>

                  <Link
                    href="/discord"
                    className="mt-1 inline-block text-[12px] font-semibold text-white/75 transition-colors hover:text-white"
                  >
                    Discord Server
                  </Link>
                </div>
              </div>
            </PolicySection>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div>
                <p className="text-[13px] font-semibold text-white/90">
                  On this page
                </p>

                <div className="mt-5 border-l border-white/[0.075]">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group relative block py-2 pl-4 text-[11px] font-medium text-white/32 transition-colors hover:text-white/75"
                    >
                      <span className="absolute -left-px top-1/2 h-0 w-px -translate-y-1/2 bg-[#5360ff] transition-all duration-200 group-hover:h-4" />

                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-white/[0.07] pt-7">
                <p className="text-[13px] font-semibold text-white/90">
                  Other policies
                </p>

                <div className="mt-4 space-y-1">
                  <PolicyLink href="/terms" label="Terms of Service" />
                  <PolicyLink href="/security" label="Security" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{
        opacity: 0,
        y: 10,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.35,
      }}
      className="scroll-mt-[110px] border-b border-white/[0.06] py-10 first:pt-10"
    >
      <h2 className="mb-5 text-[20px] font-semibold tracking-[-0.55px] text-white">
        {title}
      </h2>

      <div className="space-y-4 text-[12px] leading-[1.9] text-white/48 sm:text-[13px]">
        {children}
      </div>
    </motion.section>
  );
}

function PrivacyList({ items }: { items: string[] }) {
  return (
    <ul className="my-5 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-[12px] leading-6 text-white/45 sm:text-[13px]"
        >
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={14}
            color="currentColor"
            strokeWidth={1.8}
            className="mt-[5px] shrink-0 text-[#5360ff]"
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicyLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-8 items-center text-[11px] font-medium text-white/35 transition-colors hover:text-white/75"
    >
      {label}
    </Link>
  );
}