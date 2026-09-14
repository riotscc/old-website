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
    label: "Agreement to Terms",
    href: "#agreement",
  },
  {
    label: "Definitions",
    href: "#definitions",
  },
  {
    label: "Eligibility and Authority",
    href: "#eligibility",
  },
  {
    label: "Description of Services",
    href: "#services",
  },
  {
    label: "Accounts and Security",
    href: "#accounts",
  },
  {
    label: "Profile and User Content",
    href: "#content",
  },
  {
    label: "Acceptable Use",
    href: "#acceptable-use",
  },
  {
    label: "Automated Access",
    href: "#automated-access",
  },
  {
    label: "Analytics and Security Data",
    href: "#analytics",
  },
  {
    label: "Premium and Payments",
    href: "#payments",
  },
  {
    label: "Third-Party Services",
    href: "#third-party",
  },
  {
    label: "Intellectual Property",
    href: "#intellectual-property",
  },
  {
    label: "Service Availability",
    href: "#availability",
  },
  {
    label: "Termination",
    href: "#termination",
  },
  {
    label: "Warranty Disclaimer",
    href: "#disclaimer",
  },
  {
    label: "Limitation of Liability",
    href: "#liability",
  },
  {
    label: "Changes to These Terms",
    href: "#changes",
  },
  {
    label: "Governing Law",
    href: "#governing-law",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function TermsPage() {
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
                Terms of Service
              </h1>

              <p className="mx-auto mt-4 max-w-[650px] text-[12px] leading-6 text-white/42 sm:text-[13px]">
                The terms that apply when you access or use carts.lol,
                including our profiles, dashboards, services, and paid
                features.
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
                These Terms of Service form an agreement between you and
                carts.lol. Please read them before using the Services.
              </p>
            </div>

            <PolicySection id="agreement" title="Agreement to Terms">
              <p>
                These Terms of Service ("Terms") govern your access to and use
                of carts.lol, including our websites, public profile pages,
                dashboards, authentication systems, analytics, uploads, links,
                customization features, APIs, Premium features, and related
                products or services collectively referred to as the
                "Services."
              </p>

              <p>
                By accessing or using the Services, you confirm that you have
                read and understood these Terms and agree to follow them. If you
                do not agree to these Terms, you must not use the Services.
              </p>

              <p>
                These Terms apply to both registered users and visitors where
                applicable. Additional terms may apply to specific features,
                integrations, paid products, or third-party services.
              </p>
            </PolicySection>

            <PolicySection id="definitions" title="Definitions">
              <SecurityList
                items={[
                  '"Account" means a registered carts.lol account or other authorized method used to access protected parts of the Services.',
                  '"Content" means text, links, images, files, audio, profile information, metadata, or other material submitted through the Services.',
                  '"User Content" means Content uploaded, submitted, configured, or otherwise provided by a user.',
                  '"Services" means carts.lol websites, dashboards, profiles, APIs, analytics systems, customization tools, storage features, Premium features, and related services.',
                  '"Premium" means paid functionality, plans, features, increased limits, or other upgraded services made available by carts.lol.',
                  '"Analytics Data" means information generated from visits, interactions, devices, referrers, traffic, or use of a profile or feature.',
                  '"Security Data" means technical information processed to detect abuse, protect accounts, investigate incidents, or secure the Services.',
                ]}
              />
            </PolicySection>

            <PolicySection
              id="eligibility"
              title="Eligibility and Authority"
            >
              <p>
                You must meet the minimum age required to use the Services in
                your jurisdiction and must have the legal ability to agree to
                these Terms.
              </p>

              <p>
                If you are using carts.lol on behalf of a business,
                organization, community, or other entity, you represent that you
                are authorized to accept these Terms on its behalf.
              </p>

              <p>
                You may not use the Services if doing so would violate an
                applicable law, regulation, court order, sanction, or other
                legal restriction.
              </p>
            </PolicySection>

            <PolicySection id="services" title="Description of Services">
              <p>
                carts.lol provides tools for creating and hosting customizable
                profile pages and managing the content displayed through those
                profiles. Features may include links, media, profile
                customization, analytics, account settings, uploads, badges,
                aliases, templates, and other functionality made available
                through the dashboard.
              </p>

              <p>
                Certain features may process technical information associated
                with visits or requests to provide analytics, detect abuse,
                enforce limits, maintain security, and operate the platform.
              </p>

              <p>
                We may add, remove, replace, limit, redesign, or discontinue
                features as the Services change.
              </p>
            </PolicySection>

            <PolicySection id="accounts" title="Accounts and Security">
              <p>
                You are responsible for activity performed through your Account
                and for maintaining control of your login credentials, active
                sessions, connected accounts, and other authentication
                information.
              </p>

              <SecurityList
                items={[
                  "Do not share passwords, active sessions, authentication tokens, or other credentials with unauthorized users.",
                  "Do not access or attempt to access another user's Account without permission.",
                  "Notify us if you reasonably believe your Account has been compromised.",
                  "Use accurate information when it is required for account security, billing, or support.",
                  "Do not create Accounts for the purpose of bypassing enforcement actions, limits, restrictions, or suspensions.",
                ]}
              />

              <p>
                We may restrict Account activity when we reasonably believe an
                Account is compromised, being abused, or creating a security
                risk to the Services or other users.
              </p>
            </PolicySection>

            <PolicySection id="content" title="Profile and User Content">
              <p>
                You retain ownership of User Content you submit to carts.lol.
                You give carts.lol permission to host, store, process, display,
                reproduce, resize, transcode, cache, and distribute that Content
                only as reasonably necessary to provide, operate, secure, and
                improve the Services.
              </p>

              <p>
                You are responsible for ensuring that you have the rights
                required to upload or display the Content you submit.
              </p>

              <SecurityList
                items={[
                  "You may not upload Content that infringes another person's intellectual property rights.",
                  "You may not use carts.lol to distribute malware, credential stealers, malicious downloads, or deceptive files.",
                  "You may not intentionally use profile content to impersonate another person or organization in a misleading manner.",
                  "You may not upload Content that is unlawful to possess, publish, or distribute.",
                  "Content may be removed or restricted when necessary to enforce these Terms or comply with legal requirements.",
                ]}
              />
            </PolicySection>

            <PolicySection id="acceptable-use" title="Acceptable Use">
              <p>
                You may use the Services only for lawful purposes and in a way
                that does not interfere with the operation, security, or
                availability of carts.lol.
              </p>

              <p>You may not use the Services to:</p>

              <SecurityList
                items={[
                  "Violate applicable laws, regulations, court orders, or third-party platform rules.",
                  "Bypass authentication, authorization, security controls, access restrictions, or enforcement measures.",
                  "Probe, scan, exploit, or attack carts.lol systems without authorization.",
                  "Distribute malware, phishing pages, credential theft tools, malicious redirects, or harmful downloads.",
                  "Harass, threaten, exploit, defraud, or intentionally deceive other users.",
                  "Interfere with the normal operation of the Services or intentionally degrade availability.",
                  "Use the Services to host or distribute unlawful material.",
                  "Attempt to gain unauthorized access to Accounts, databases, administrative systems, internal services, or infrastructure.",
                  "Use multiple Accounts or other methods to evade suspensions, bans, restrictions, quotas, or usage limits.",
                ]}
              />
            </PolicySection>

            <PolicySection
              id="automated-access"
              title="Automated Access and Rate Limits"
            >
              <p>
                Automated access to carts.lol must follow any technical
                restrictions, rate limits, authentication requirements, and
                usage rules that apply to the relevant service or endpoint.
              </p>

              <SecurityList
                items={[
                  "Do not use automated scripts to create excessive requests or degrade the Services.",
                  "Do not rotate Accounts, IP addresses, sessions, proxies, credentials, or similar identifiers to bypass rate limits.",
                  "Do not scrape private, restricted, authenticated, or non-public information.",
                  "Do not attempt to bypass quotas, upload limits, storage limits, or other product restrictions.",
                  "Do not use undocumented internal endpoints in a manner that interferes with the Services or circumvents intended access controls.",
                ]}
              />

              <p>
                Automated activity may be blocked, rate limited, challenged, or
                suspended when it creates unusual traffic, security concerns,
                or excessive resource usage.
              </p>
            </PolicySection>

            <PolicySection
              id="analytics"
              title="Analytics and Security Data"
            >
              <p>
                carts.lol may process technical and usage information to provide
                profile analytics, maintain the Services, prevent abuse, detect
                suspicious activity, and investigate security incidents.
              </p>

              <p>
                Depending on the feature being used, this information may
                include timestamps, device categories, referrers, request
                information, profile visits, link interactions, account
                identifiers, network information, and derived security or abuse
                indicators.
              </p>

              <p>
                Analytics displayed to users may be aggregated, normalized, or
                otherwise processed before being presented through the
                dashboard.
              </p>
            </PolicySection>

            <PolicySection id="payments" title="Premium, Fees, and Refunds">
              <p>
                Some carts.lol features require payment. The price, billing
                model, and included features will be shown before you complete a
                purchase.
              </p>

              <p>
                Unless otherwise required by applicable law or specifically
                stated at the time of purchase, payments are final and
                non-refundable after the paid feature has been delivered or
                activated.
              </p>

              <SecurityList
                items={[
                  "You are responsible for providing valid payment information.",
                  "Paid features may be tied to the Account that completed or received the purchase.",
                  "Feature availability may change as carts.lol is updated.",
                  "A lifetime purchase refers to the lifetime of the applicable product or service, not the lifetime of an individual user.",
                  "Purchasing Premium does not exempt an Account from these Terms or platform enforcement.",
                ]}
              />

              <p>
                Payments may be processed through Stripe or another payment
                processor. Payment processors may apply their own terms,
                policies, verification requirements, and fraud controls.
              </p>
            </PolicySection>

            <PolicySection
              id="third-party"
              title="Third-Party Services"
            >
              <p>
                carts.lol may integrate with or link to third-party services.
                These may include authentication providers, payment processors,
                content delivery providers, social platforms, or external sites
                linked from user profiles.
              </p>

              <p>
                carts.lol does not control the content, availability, privacy
                practices, security practices, or policies of independent
                third-party services.
              </p>

              <p>
                Your use of a third-party service may be governed by separate
                terms between you and that provider.
              </p>
            </PolicySection>

            <PolicySection
              id="intellectual-property"
              title="Intellectual Property"
            >
              <p>
                The carts.lol name, branding, website design, software,
                interfaces, source code, platform features, graphics, and other
                materials provided by carts.lol are protected by applicable
                intellectual property laws.
              </p>

              <p>
                Except where expressly permitted, you may not copy, sell,
                sublicense, redistribute, reverse engineer, reproduce, or create
                a competing derivative service using carts.lol proprietary
                software or materials.
              </p>

              <p>
                These Terms do not transfer ownership of carts.lol intellectual
                property to you.
              </p>
            </PolicySection>

            <PolicySection
              id="availability"
              title="Service Availability and Changes"
            >
              <p>
                carts.lol may be unavailable from time to time because of
                maintenance, updates, outages, infrastructure problems, security
                events, third-party failures, or circumstances outside our
                control.
              </p>

              <p>
                We do not guarantee that every feature will remain available
                permanently or that the Services will operate without
                interruption.
              </p>

              <SecurityList
                items={[
                  "Features may be added, modified, limited, or discontinued.",
                  "Usage limits and technical requirements may change.",
                  "Temporary restrictions may be applied to maintain security or service stability.",
                  "Maintenance may occur without advance notice when an immediate change is required.",
                ]}
              />
            </PolicySection>

            <PolicySection id="termination" title="Suspension and Termination">
              <p>
                carts.lol may limit, suspend, or terminate access to the
                Services when an Account violates these Terms, creates a
                security risk, abuses the Services, exposes carts.lol to legal
                risk, or interferes with other users.
              </p>

              <p>
                Enforcement may apply to an individual feature, Account, group
                of Accounts, session, upload, API access method, or other
                resource depending on the issue.
              </p>

              <SecurityList
                items={[
                  "Attempts to bypass a suspension may result in additional Accounts being restricted.",
                  "Malicious or abusive automated activity may result in immediate access restrictions.",
                  "Content may be removed without terminating the entire Account when content-specific enforcement is sufficient.",
                  "Serious security abuse may result in immediate termination without advance notice.",
                ]}
              />

              <p>
                When an Account is terminated, the right to access protected
                parts of the Services associated with that Account ends
                immediately.
              </p>
            </PolicySection>

            <PolicySection id="disclaimer" title="Warranty Disclaimer">
              <p className="font-medium uppercase text-white/60">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." TO THE
                MAXIMUM EXTENT PERMITTED BY LAW, CARTS.LOL DISCLAIMS ALL
                WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                NON-INFRINGEMENT, AVAILABILITY, ACCURACY, AND SECURITY.
              </p>

              <p>
                We do not guarantee that the Services will always be available,
                free from errors, free from vulnerabilities, or suitable for
                every use case.
              </p>
            </PolicySection>

            <PolicySection id="liability" title="Limitation of Liability">
              <p className="font-medium uppercase text-white/60">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CARTS.LOL
                WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR
                RELATED TO YOUR USE OF THE SERVICES.
              </p>

              <p>
                This includes, where permitted by law, losses related to data,
                revenue, profits, reputation, service interruption, account
                access, or third-party content.
              </p>

              <p>
                To the maximum extent permitted by law, carts.lol's total
                liability arising from or relating to the Services will not
                exceed the greater of the amount you paid directly to carts.lol
                during the three months before the event giving rise to the
                claim or USD $100.
              </p>
            </PolicySection>

            <PolicySection id="changes" title="Changes to These Terms">
              <p>
                We may update these Terms when carts.lol changes, when new
                features are introduced, or when legal, security, or operational
                requirements change.
              </p>

              <p>
                The date at the top of this page identifies the most recent
                revision. Continued use of the Services after updated Terms take
                effect means you agree to the revised Terms.
              </p>

              <p>
                If a change materially affects your rights or obligations, we
                may provide additional notice where appropriate.
              </p>
            </PolicySection>

            <PolicySection id="governing-law" title="Governing Law">
              <p>
                These Terms are governed by the laws applicable to carts.lol's
                operating entity - Delaware, without regard to conflict-of-law principles,
                except where the law of your jurisdiction requires otherwise.
              </p>

              <p>
                Any dispute relating to these Terms or the Services must be
                brought in a court with appropriate jurisdiction unless
                applicable law requires a different forum.
              </p>
            </PolicySection>

            <PolicySection id="contact" title="Contact">
              <p>
                Questions regarding these Terms, legal requests, or other
                policy-related matters can be sent to:
              </p>

              <div className="mt-6 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-5">
                <div>
                  <p className="text-[11px] font-medium text-white/35">
                    Legal inquiries
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
                  <PolicyLink href="/privacy" label="Privacy Policy" />
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

function SecurityList({ items }: { items: string[] }) {
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