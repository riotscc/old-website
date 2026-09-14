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
    label: "Security Overview",
    href: "#security-overview",
  },
  {
    label: "Account Security",
    href: "#account-security",
  },
  {
    label: "Data Protection",
    href: "#data-protection",
  },
  {
    label: "Application Security",
    href: "#application-security",
  },
  {
    label: "Infrastructure Security",
    href: "#infrastructure-security",
  },
  {
    label: "Access Control",
    href: "#access-control",
  },
  {
    label: "Network Security",
    href: "#network-security",
  },
  {
    label: "Monitoring & Response",
    href: "#monitoring-response",
  },
  {
    label: "Responsible Disclosure",
    href: "#responsible-disclosure",
  },
];

export default function SecurityPage() {
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
                Built with Security in Mind
              </h1>

              <p className="mx-auto mt-4 max-w-[650px] text-[12px] leading-6 text-white/42 sm:text-[13px]">
                An overview of how carts.lol protects accounts, sessions, stored
                data, application traffic, and production infrastructure.
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
                This document explains the security controls used to protect
                carts.lol accounts, user data, and production services.
              </p>
            </div>

            <PolicySection id="security-overview" title="Security Overview">
              <p>
                carts.lol uses multiple security controls instead of relying on
                a single protection mechanism. These controls cover account
                access, application requests, stored information, internal
                services, and the infrastructure that runs the platform.
              </p>

              <p>
                Security controls are reviewed as the service changes. When a
                new feature affects authentication, private information, file
                handling, or other sensitive functionality, its access
                requirements and potential exposure are considered as part of
                development.
              </p>

              <SecurityList
                items={[
                  "Access to sensitive systems is limited to the services and personnel that require it.",
                  "Application and authentication activity may be monitored for abuse, unusual traffic, or attempted unauthorized access.",
                  "Connections to carts.lol are protected using encrypted transport where supported.",
                  "Security issues are evaluated based on their potential effect on users, data, and service availability.",
                ]}
              />
            </PolicySection>

            <PolicySection id="account-security" title="Account Security">
              <p>
                Account security covers the systems used to authenticate users,
                create sessions, and authorize account-level actions.
                Authentication alone does not grant unrestricted access to the
                application. Protected actions must still pass the relevant
                authorization checks.
              </p>

              <SecurityList
                items={[
                  "Authentication requests are processed through controlled login flows rather than directly exposing account credentials to application pages.",
                  "Sessions can be invalidated when a user logs out, when a session expires, or when access needs to be revoked.",
                  "Protected account actions require a valid authenticated session.",
                  "Authentication endpoints can be restricted when requests appear automated, abusive, or otherwise suspicious.",
                  "Sensitive account changes may require additional validation before they are accepted.",
                ]}
              />

              <p>
                Users should not share passwords, login links, session values,
                authentication tokens, or any other information that can be
                used to access their account. If account access may have been
                exposed, the affected session should be ended as soon as
                possible.
              </p>
            </PolicySection>

            <PolicySection id="data-protection" title="Data Protection">
              <p>
                carts.lol stores information needed to provide profiles,
                authentication, analytics, account settings, and other platform
                features. We also retain information when it is needed for
                security, fraud prevention, service reliability, or support.
              </p>

              <p>
                Data access is restricted based on its purpose. Internal
                services should only request information they need to perform
                their function, and user information is not intended to be
                directly accessible through internal databases or administrative
                services without authorization.
              </p>

              <SecurityList
                items={[
                  "Data transmitted between supported clients and carts.lol is sent over encrypted connections.",
                  "Production databases and internal services are not intended to be directly exposed to the public internet.",
                  "Access to stored information is limited to legitimate application, operational, support, and security requirements.",
                  "Backups may be maintained so important service data can be recovered after infrastructure or storage failures.",
                  "Information is retained according to the requirements of the feature, security needs, and applicable operational obligations.",
                ]}
              />
            </PolicySection>

            <PolicySection
              id="application-security"
              title="Application Security"
            >
              <p>
                Application security focuses on how user-controlled data is
                accepted, processed, and returned by carts.lol. Public input is
                treated as untrusted and should be validated before it reaches
                protected application logic or storage.
              </p>

              <SecurityList
                items={[
                  "User-controlled values are validated before being used by protected application operations where applicable.",
                  "Authentication and authorization checks are performed before requests can access protected account functionality.",
                  "Application dependencies can be updated when relevant security fixes become available.",
                  "Errors returned to users are designed to avoid unnecessarily exposing internal application or infrastructure details.",
                  "Features that affect authentication, permissions, uploads, or private information can receive additional security review.",
                ]}
              />

              <p>
                When a vulnerability is confirmed, the response depends on its
                impact. A fix may involve changing application logic, removing
                access to an affected feature, invalidating sessions, updating
                a dependency, modifying infrastructure configuration, or
                temporarily limiting requests.
              </p>
            </PolicySection>

            <PolicySection
              id="infrastructure-security"
              title="Infrastructure Security"
            >
              <p>
                Production infrastructure supports the carts.lol website, API,
                databases, file delivery, authentication services, and related
                systems. Administrative and internal services are separated from
                normal public-facing application traffic where appropriate.
              </p>

              <SecurityList
                items={[
                  "Only services that need to accept public traffic should be exposed through public interfaces.",
                  "Administrative services and production management interfaces are restricted from normal user access.",
                  "Production systems can be updated as operating system, runtime, dependency, or service fixes become necessary.",
                  "Backups and recovery procedures may be used to restore service after data loss or infrastructure failure.",
                  "Service health and infrastructure behavior may be monitored to identify failures or unusual activity.",
                ]}
              />
            </PolicySection>

            <PolicySection id="access-control" title="Access Control">
              <p>
                Internal access is granted based on operational need. Access to
                production services, user information, administrative tools,
                and other sensitive systems should remain limited to the
                minimum permissions required to perform an authorized task.
              </p>

              <p>
                Access can be changed or removed when responsibilities change,
                when access is no longer required, or when there is a security
                reason to revoke it.
              </p>

              <SecurityList
                items={[
                  "Administrative functionality is separated from normal user-level access.",
                  "Permissions are limited according to the system or operation being performed.",
                  "Sensitive internal systems require authenticated access.",
                  "Access that is no longer required can be revoked.",
                  "Administrative or security-sensitive activity may be logged for review.",
                ]}
              />
            </PolicySection>

            <PolicySection id="network-security" title="Network Security">
              <p>
                Network controls are used to limit unnecessary exposure and
                reduce the effect of automated abuse, malicious requests, and
                unauthorized attempts to reach internal services.
              </p>

              <SecurityList
                items={[
                  "Public access is limited to the services and endpoints required to operate carts.lol.",
                  "Traffic can be rate limited, filtered, or blocked when request patterns indicate abuse or excessive automated activity.",
                  "Supported production traffic uses encrypted connections between clients and public services.",
                  "Network protections may be used to reduce denial-of-service attempts and other high-volume abusive traffic.",
                  "Internal services are separated from direct public access where their function does not require it.",
                ]}
              />
            </PolicySection>

            <PolicySection
              id="monitoring-response"
              title="Monitoring & Response"
            >
              <p>
                Operational and security monitoring is used to identify service
                failures, suspicious requests, authentication abuse, unexpected
                traffic, and other activity that may require investigation.
              </p>

              <p>
                A security incident is handled according to its scope and
                severity. Immediate containment may occur before the full cause
                is known when leaving an affected system online would create
                additional risk.
              </p>

              <SecurityList
                items={[
                  "Security-related application and infrastructure events may be recorded for investigation.",
                  "Potential incidents are reviewed based on the systems, accounts, and information that could be affected.",
                  "Affected services or features may be restricted while an issue is investigated.",
                  "Sessions or credentials may be invalidated when continued access could create additional risk.",
                  "Security fixes may be deployed without advance notice when delaying the change would leave users or systems exposed.",
                ]}
              />
            </PolicySection>

            <PolicySection
              id="responsible-disclosure"
              title="Responsible Disclosure"
            >
              <p>
                If you discover a vulnerability affecting carts.lol, report it
                privately before publishing technical details or
                proof-of-concept material. Reports should contain enough
                information for the issue to be reproduced and evaluated.
              </p>

              <p>
                Security testing must not intentionally access another user's
                private information, modify or destroy data that does not belong
                to the researcher, interrupt service availability, perform
                social engineering, distribute malware, or continue testing
                after sufficient evidence of a vulnerability has been obtained.
              </p>

              <SecurityList
                items={[
                  "Include the affected page, endpoint, or feature.",
                  "Provide clear steps that reproduce the issue.",
                  "Describe what an attacker could access or change if the issue were exploited.",
                  "Include screenshots, request examples, or other supporting information when useful.",
                  "Do not publicly disclose the vulnerability before carts.lol has had reasonable time to investigate and address it.",
                ]}
              />

              <div className="mt-6 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-[12px] font-semibold text-white/85">
                  Report a vulnerability
                </p>

                <p className="mt-2 max-w-[640px] text-[11px] leading-5 text-white/35">
                  Send the affected feature, reproduction steps, potential
                  impact, and any supporting request or response information
                  that can help verify the issue.
                </p>

                <a
                  href="mailto:security@carts.lol"
                  className="mt-5 inline-flex h-9 items-center rounded-full border border-white/[0.09] bg-white/[0.045] px-4 text-[11px] font-semibold text-white/70 transition-all hover:bg-white/[0.075] hover:text-white"
                >
                  security@carts.lol
                </a>
              </div>
            </PolicySection>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[100px]">
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
                  <PolicyLink href="/terms" label="Terms of Service" />
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