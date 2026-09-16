"use client";

import * as React from "react";
import Link from "next/link";
import SaveBar from "@/components/custom/savebar";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import type { IconType } from "react-icons";

import {
  SiSnapchat,
  SiYoutube,
  SiDiscord,
  SiSpotify,
  SiInstagram,
  SiX,
  SiTiktok,
  SiTelegram,
  SiSignal,
  SiSoundcloud,
  SiPaypal,
  SiGithub,
  SiRoblox,
  SiCashapp,
  SiVimeo,
  SiPlaystation,
  SiApplemusic,
  SiGitlab,
  SiTwitch,
  SiReddit,
  SiVk,
  SiBluesky,
  SiMedium,
  SiSteam,
  SiKick,
  SiPinterest,
  SiVenmo,
  SiFacebook,
  SiThreads,
  SiMessenger,
  SiBitcoin,
  SiEthereum,
  SiLitecoin,
  SiSolana,
  SiMonero,
  SiGmail,
} from "react-icons/si";

import {
  FaLinkedin,
  FaXbox,
} from "react-icons/fa6";

type LinkBehavior = "link" | "copy";

type Platform = {
  id: string;
  name: string;
  icon: IconType;
  color: string;
  prefix?: string;
  placeholder: string;
};

type UserLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  icon: string | null;
  customIconUrl: string | null;
  behavior: LinkBehavior;
  position: number;
  enabled: boolean;
};

type LinksResponse = {
  success?: boolean;
  user?: {
    id: string;
    username: string;
  };
  links?: UserLink[];
  settings?: {
    linkIconSize?: number;
    monochromeIcons?: boolean;
    monochromeIconColor?: string;
    linkIconGlow?: boolean;
    linkIconGlowHover?: boolean;
    linkIconTooltip?: boolean;
  };
  link?: UserLink;
  error?: string;
};

type LinkSettings = {
  linkIconSize: number;
  monochromeIcons: boolean;
  monochromeIconColor: string;
  linkIconGlow: boolean;
  linkIconGlowHover: boolean;
  linkIconTooltip: boolean;
};

const platforms: Platform[] = [
  {
    id: "snapchat",
    name: "Snapchat",
    icon: SiSnapchat,
    color: "#FFFC00",
    prefix: "snapchat.com/add/",
    placeholder: "username",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: SiYoutube,
    color: "#FF0033",
    prefix: "youtube.com/@",
    placeholder: "username",
  },
  {
    id: "discord",
    name: "Discord",
    icon: SiDiscord,
    color: "#5865F2",
    prefix: "discord.gg/",
    placeholder: "invite",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: SiSpotify,
    color: "#1ED760",
    placeholder: "https://open.spotify.com/...",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "#E4405F",
    prefix: "instagram.com/",
    placeholder: "username",
  },
  {
    id: "x",
    name: "X",
    icon: SiX,
    color: "#FFFFFF",
    prefix: "x.com/",
    placeholder: "username",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "#FFFFFF",
    prefix: "tiktok.com/@",
    placeholder: "username",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: SiTelegram,
    color: "#26A5E4",
    prefix: "t.me/",
    placeholder: "username",
  },
  {
    id: "signal",
    name: "Signal",
    icon: SiSignal,
    color: "#3A76F0",
    placeholder: "https://signal.me/...",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    icon: SiSoundcloud,
    color: "#FF5500",
    prefix: "soundcloud.com/",
    placeholder: "username",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: SiPaypal,
    color: "#009CDE",
    prefix: "paypal.me/",
    placeholder: "username",
  },
  {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    color: "#FFFFFF",
    prefix: "github.com/",
    placeholder: "username",
  },
  {
    id: "roblox",
    name: "Roblox",
    icon: SiRoblox,
    color: "#FFFFFF",
    placeholder: "https://www.roblox.com/users/...",
  },
  {
    id: "cashapp",
    name: "Cash App",
    icon: SiCashapp,
    color: "#00D64F",
    prefix: "cash.app/$",
    placeholder: "cashtag",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    icon: SiVimeo,
    color: "#1AB7EA",
    prefix: "vimeo.com/",
    placeholder: "username",
  },
  {
    id: "playstation",
    name: "PlayStation",
    icon: SiPlaystation,
    color: "#0070D1",
    placeholder: "profile URL",
  },
  {
    id: "xbox",
    name: "Xbox",
    icon: FaXbox,
    color: "#107C10",
    placeholder: "profile URL",
  },
  {
    id: "apple-music",
    name: "Apple Music",
    icon: SiApplemusic,
    color: "#FA243C",
    placeholder: "Apple Music URL",
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: SiGitlab,
    color: "#FC6D26",
    prefix: "gitlab.com/",
    placeholder: "username",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: SiTwitch,
    color: "#9146FF",
    prefix: "twitch.tv/",
    placeholder: "username",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: SiReddit,
    color: "#FF4500",
    prefix: "reddit.com/u/",
    placeholder: "username",
  },
  {
    id: "vk",
    name: "VK",
    icon: SiVk,
    color: "#0077FF",
    prefix: "vk.com/",
    placeholder: "username",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    icon: SiBluesky,
    color: "#1185FE",
    prefix: "bsky.app/profile/",
    placeholder: "handle",
  },
  {
    id: "medium",
    name: "Medium",
    icon: SiMedium,
    color: "#FFFFFF",
    prefix: "medium.com/@",
    placeholder: "username",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    placeholder: "LinkedIn URL",
  },
  {
    id: "steam",
    name: "Steam",
    icon: SiSteam,
    color: "#66C0F4",
    placeholder: "Steam profile URL",
  },
  {
    id: "kick",
    name: "Kick",
    icon: SiKick,
    color: "#53FC18",
    prefix: "kick.com/",
    placeholder: "username",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: SiPinterest,
    color: "#E60023",
    prefix: "pinterest.com/",
    placeholder: "username",
  },
  {
    id: "venmo",
    name: "Venmo",
    icon: SiVenmo,
    color: "#3D95CE",
    prefix: "venmo.com/u/",
    placeholder: "username",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: SiFacebook,
    color: "#1877F2",
    prefix: "facebook.com/",
    placeholder: "username",
  },
  {
    id: "threads",
    name: "Threads",
    icon: SiThreads,
    color: "#FFFFFF",
    prefix: "threads.net/@",
    placeholder: "username",
  },
  {
    id: "messenger",
    name: "Messenger",
    icon: SiMessenger,
    color: "#00B2FF",
    placeholder: "Messenger URL",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: SiBitcoin,
    color: "#F7931A",
    placeholder: "wallet address",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: SiEthereum,
    color: "#627EEA",
    placeholder: "wallet address",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    icon: SiLitecoin,
    color: "#A6A9AA",
    placeholder: "wallet address",
  },
  {
    id: "solana",
    name: "Solana",
    icon: SiSolana,
    color: "#14F195",
    placeholder: "wallet address",
  },
  {
    id: "monero",
    name: "Monero",
    icon: SiMonero,
    color: "#FF6600",
    placeholder: "wallet address",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: SiGmail,
    color: "#EA4335",
    prefix: "mailto:",
    placeholder: "email@example.com",
  },
];

function buildValue(
  platform: Platform,
  value: string
) {
  const trimmed = value.trim();

  if (!platform.prefix) {
    if (
      /^https?:\/\//i.test(trimmed) ||
      trimmed.startsWith("mailto:")
    ) {
      return trimmed;
    }

    return trimmed;
  }

  if (platform.prefix === "mailto:") {
    return `mailto:${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${platform.prefix}${trimmed}`;
}

export default function LinksCard() {
  const [username, setUsername] = React.useState("");
  const [links, setLinks] = React.useState<UserLink[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPlatform, setSelectedPlatform] =
    React.useState<Platform | null>(null);
  const [customModal, setCustomModal] = React.useState(false);
  const [behavior, setBehavior] =
    React.useState<LinkBehavior>("link");
  const [value, setValue] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [customIconUrl, setCustomIconUrl] = React.useState("");
  const [uploadingIcon, setUploadingIcon] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [monochrome, setMonochrome] = React.useState(false);
  const [monochromeColor, setMonochromeColor] =
    React.useState("#ffffff");
  const [iconGlow, setIconGlow] = React.useState(false);
  const [glowOnHover, setGlowOnHover] = React.useState(false);
  const [tooltip, setTooltip] = React.useState(true);
  const [iconSize, setIconSize] = React.useState(20);
  const [showIconSize, setShowIconSize] = React.useState(false);
  const [savedSettings, setSavedSettings] =
    React.useState<LinkSettings | null>(null);
  const [savingSettings, setSavingSettings] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentSettings = React.useMemo<LinkSettings>(
    () => ({
      linkIconSize: iconSize,
      monochromeIcons: monochrome,
      monochromeIconColor: monochromeColor,
      linkIconGlow: iconGlow,
      linkIconGlowHover: glowOnHover,
      linkIconTooltip: tooltip,
    }),
    [
      iconSize,
      monochrome,
      monochromeColor,
      iconGlow,
      glowOnHover,
      tooltip,
    ]
  );

  const hasUnsavedChanges = React.useMemo(() => {
    if (!savedSettings) {
      return false;
    }

    return (
      JSON.stringify(currentSettings) !==
      JSON.stringify(savedSettings)
    );
  }, [currentSettings, savedSettings]);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/account/links", {
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json()) as LinksResponse;

        if (!mounted || !response.ok) {
          return;
        }

        setUsername(data.user?.username || "");
        setLinks(Array.isArray(data.links) ? data.links : []);

        if (data.settings) {
          const nextSettings: LinkSettings = {
            linkIconSize: Number(
              data.settings.linkIconSize ?? 20
            ),
            monochromeIcons: Boolean(
              data.settings.monochromeIcons
            ),
            monochromeIconColor:
              data.settings.monochromeIconColor || "#ffffff",
            linkIconGlow: Boolean(
              data.settings.linkIconGlow
            ),
            linkIconGlowHover: Boolean(
              data.settings.linkIconGlowHover
            ),
            linkIconTooltip:
              data.settings.linkIconTooltip !== false,
          };

          setIconSize(nextSettings.linkIconSize);
          setMonochrome(nextSettings.monochromeIcons);
          setMonochromeColor(nextSettings.monochromeIconColor);
          setIconGlow(nextSettings.linkIconGlow);
          setGlowOnHover(nextSettings.linkIconGlowHover);
          setTooltip(nextSettings.linkIconTooltip);
          setSavedSettings(nextSettings);
        }
      } catch {
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  function resetModal() {
    setSelectedPlatform(null);
    setCustomModal(false);
    setBehavior("link");
    setValue("");
    setLabel("");
    setCustomIconUrl("");
    setUploadingIcon(false);
    setSaving(false);
    setError("");
  }

  function openPlatform(platform: Platform) {
    setBehavior("link");
    setValue("");
    setLabel("");
    setCustomIconUrl("");
    setError("");
    setCustomModal(false);
    setSelectedPlatform(platform);
  }

  function openCustom() {
    setBehavior("link");
    setValue("");
    setLabel("");
    setCustomIconUrl("");
    setError("");
    setSelectedPlatform(null);
    setCustomModal(true);
  }

  async function handleSaveSettings() {
    if (
      !savedSettings ||
      !hasUnsavedChanges ||
      savingSettings
    ) {
      return;
    }

    try {
      setSavingSettings(true);

      const response = await fetch("/api/account/links", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          settings: currentSettings,
        }),
      });

      if (!response.ok) {
        return;
      }

      setSavedSettings({
        ...currentSettings,
      });
    } catch {
    } finally {
      setSavingSettings(false);
    }
  }

  function handleUndoSettings() {
    if (!savedSettings || savingSettings) {
      return;
    }

    setIconSize(savedSettings.linkIconSize);
    setMonochrome(savedSettings.monochromeIcons);
    setMonochromeColor(savedSettings.monochromeIconColor);
    setIconGlow(savedSettings.linkIconGlow);
    setGlowOnHover(savedSettings.linkIconGlowHover);
    setTooltip(savedSettings.linkIconTooltip);
  }

  async function addLink() {
    if (saving) {
      return;
    }

    const platform = customModal
      ? null
      : selectedPlatform;

    if (!customModal && !platform) {
      return;
    }

    if (!value.trim()) {
      setError("Enter a value.");
      return;
    }

    const finalValue = customModal
      ? value.trim()
      : buildValue(platform!, value);

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/account/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          platform: customModal
            ? "custom"
            : platform!.id,
          label:
            label.trim() ||
            (customModal
              ? "Custom URL"
              : platform!.name),
          url: finalValue,
          icon: customModal
            ? "custom"
            : platform!.id,
          customIconUrl:
            customModal && customIconUrl
              ? customIconUrl
              : null,
          behavior,
        }),
      });

      const data = (await response.json()) as LinksResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.link
      ) {
        setError(data.error || "Failed to add link.");
        return;
      }

      setLinks((current) => [
        ...current,
        data.link!,
      ]);

      resetModal();
    } catch {
      setError("Failed to add link.");
    } finally {
      setSaving(false);
    }
  }

  async function removeLink(id: string) {
    try {
      const response = await fetch("/api/account/links", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        return;
      }

      setLinks((current) =>
        current.filter((link) => link.id !== id)
      );
    } catch {}
  }

  async function uploadCustomIcon(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingIcon(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/account/links/icon",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.url) {
        setError(
          data?.error ||
            "Failed to upload icon."
        );
        return;
      }

      setCustomIconUrl(data.url);
    } catch {
      setError("Failed to upload icon.");
    } finally {
      setUploadingIcon(false);
      event.target.value = "";
    }
  }

  const modalOpen =
    Boolean(selectedPlatform) || customModal;

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full pt-5 text-[#111111] dark:text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="text-black/35 dark:text-white/30">
              Dashboard
            </span>
            <span className="text-black/25 dark:text-white/20">
              ›
            </span>
            <span className="text-black/80 dark:text-white/80">
              Links
            </span>
          </div>

          <Link
            href={username ? `/${username}` : "/"}
            target="_blank"
            className="flex h-9 items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.025] px-4 text-[11px] font-semibold text-black/55 transition hover:border-black/[0.14] hover:bg-black/[0.05] hover:text-black dark:border-white/[0.075] dark:bg-white/[0.025] dark:text-white/55 dark:hover:border-white/[0.12] dark:hover:bg-white/[0.05] dark:hover:text-white"
          >
            <HugeiconsIcon
              icon={Globe02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.7}
            />
            Live preview
          </Link>
        </div>

        <div className="mt-7">
          <h1 className="text-[22px] font-semibold tracking-[-0.6px] text-[#111111] dark:text-white">
            Links
          </h1>

          <p className="mt-1.5 text-[11px] text-black/45 dark:text-white/35">
            Add social profiles and custom URLs for your page.
          </p>
        </div>

        <section className="mt-5 rounded-[20px] border border-black/[0.08] bg-white p-5 dark:border-white/[0.065] dark:bg-[#0c0c0c]">
          <p className="text-[10px] text-black/40 dark:text-white/30">
            Pick a platform to add to your profile.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;

              return (
                <button
                  key={platform.id}
                  type="button"
                  title={platform.name}
                  onClick={() =>
                    openPlatform(platform)
                  }
                  className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] border border-black/[0.08] bg-black/[0.025] transition hover:border-black/[0.14] hover:bg-black/[0.05] dark:border-white/[0.065] dark:bg-[#151515] dark:hover:border-white/[0.13] dark:hover:bg-[#1a1a1a]"
                >
                  <Icon
                    size={23}
                    className={
                      platform.color === "#FFFFFF"
                        ? "text-black dark:text-white"
                        : undefined
                    }
                    style={
                      platform.color === "#FFFFFF"
                        ? undefined
                        : {
                            color: platform.color,
                          }
                    }
                  />
                </button>
              );
            })}

            <button
              type="button"
              onClick={openCustom}
              className="flex h-[45px] min-w-[210px] items-center gap-3 rounded-[12px] border border-black/[0.08] bg-black/[0.025] px-4 text-left transition hover:border-black/[0.14] hover:bg-black/[0.05] dark:border-white/[0.065] dark:bg-[#151515] dark:hover:border-white/[0.13] dark:hover:bg-[#1a1a1a]"
            >
              <HugeiconsIcon
                icon={Globe02Icon}
                size={17}
                color="currentColor"
                strokeWidth={1.8}
                className="text-black/60 dark:text-white/65"
              />

              <div>
                <p className="text-[10px] font-semibold text-black/75 dark:text-white/75">
                  Add Custom URL
                </p>

                <p className="text-[8px] text-black/35 dark:text-white/25">
                  Use your own URL and choose an icon to match.
                </p>
              </div>
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-[20px] border border-black/[0.08] bg-white p-5 dark:border-white/[0.065] dark:bg-[#0c0c0c]">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-black/80 dark:text-white/80">
              Link icons
            </h2>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowIconSize(
                    (current) => !current
                  )
                }
                className="rounded-full border border-black/[0.08] bg-black/[0.025] px-3 py-2 text-[9px] font-semibold text-black/55 dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-white/55"
              >
                Icon size
              </button>

              {showIconSize && (
                <div className="absolute right-0 top-10 z-20 w-[190px] rounded-[14px] border border-black/[0.08] bg-white p-4 shadow-2xl dark:border-white/[0.07] dark:bg-[#111]">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-black/45 dark:text-white/35">
                      Icon size
                    </span>

                    <span className="text-black/60 dark:text-white/60">
                      {iconSize}px
                    </span>
                  </div>

                  <input
                    type="range"
                    min={8}
                    max={128}
                    value={iconSize}
                    onChange={(event) =>
                      setIconSize(
                        Number(event.target.value)
                      )
                    }
                    className="mt-3 w-full accent-[#2832F9]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-2 xl:grid-cols-2">
            <SettingRow
              title="Monochrome icons"
              enabled={monochrome}
              onChange={() =>
                setMonochrome(
                  (current) => !current
                )
              }
            />

            <div
              className={`flex min-h-[40px] items-center gap-3 rounded-[12px] border border-black/[0.08] bg-black/[0.02] px-3 dark:border-white/[0.055] dark:bg-black/15 ${
                monochrome
                  ? ""
                  : "pointer-events-none opacity-35"
              }`}
            >
              <label
                className="relative h-5 w-5 overflow-hidden rounded-full border border-black/[0.14] dark:border-white/[0.12]"
                style={{
                  backgroundColor:
                    monochromeColor,
                }}
              >
                <input
                  type="color"
                  value={monochromeColor}
                  onChange={(event) =>
                    setMonochromeColor(
                      event.target.value
                    )
                  }
                  className="absolute inset-0 opacity-0"
                />
              </label>

              <input
                value={monochromeColor}
                onChange={(event) =>
                  setMonochromeColor(
                    event.target.value
                  )
                }
                className="flex-1 bg-transparent text-[10px] text-black/50 outline-none dark:text-white/45"
              />
            </div>

            <SettingRow
              title="Icon glow"
              enabled={iconGlow}
              onChange={() =>
                setIconGlow(
                  (current) => !current
                )
              }
            />

            <SettingRow
              title="Glow on hover"
              enabled={glowOnHover}
              onChange={() =>
                setGlowOnHover(
                  (current) => !current
                )
              }
            />

            <SettingRow
              title="Icon tooltip"
              enabled={tooltip}
              onChange={() =>
                setTooltip(
                  (current) => !current
                )
              }
            />
          </div>
        </section>

        <div className="mt-5">
          {loading ? (
            <div className="flex min-h-[90px] items-center justify-center text-[10px] text-black/30 dark:text-white/20">
              Loading links...
            </div>
          ) : links.length === 0 ? (
            <div className="flex min-h-[90px] items-center justify-center text-[10px] text-black/30 dark:text-white/20">
              Add a platform above to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {links.map((item) => {
                const platform =
                  platforms.find(
                    (entry) =>
                      entry.id === item.platform
                  );

                const Icon = platform?.icon;

                return (
                  <div
                    key={item.id}
                    className="flex min-h-[64px] items-center gap-3 rounded-[16px] border border-black/[0.08] bg-white px-4 dark:border-white/[0.065] dark:bg-[#0c0c0c]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/[0.08] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.025]">
                      {item.customIconUrl ? (
                        <img
                          src={item.customIconUrl}
                          alt=""
                          className="h-5 w-5 object-contain"
                        />
                      ) : Icon ? (
                        <Icon
                          size={20}
                          className={
                            platform?.color === "#FFFFFF"
                              ? "text-black dark:text-white"
                              : undefined
                          }
                          style={
                            platform?.color === "#FFFFFF"
                              ? undefined
                              : {
                                  color: platform?.color,
                                }
                          }
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Globe02Icon}
                          size={17}
                          color="currentColor"
                          className="text-black/50 dark:text-white/50"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[10px] font-semibold text-black/75 dark:text-white/75">
                          {item.label ||
                            platform?.name ||
                            "Custom URL"}
                        </p>

                        <span className="rounded-full border border-black/[0.08] bg-black/[0.025] px-2 py-0.5 text-[7px] font-semibold uppercase text-black/35 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/25">
                          {item.behavior}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-[9px] text-black/35 dark:text-white/25">
                        {item.url}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void removeLink(item.id)
                      }
                      className="rounded-[9px] border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-[9px] font-semibold text-black/40 transition hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-red-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/30 dark:hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-[3px]"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                resetModal();
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 8,
              }}
              className="w-full max-w-[405px] rounded-[17px] border border-black/[0.09] bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.16)] dark:border-white/[0.11] dark:bg-[#0b0b0b] dark:shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold tracking-[-0.35px] text-black dark:text-white">
                  {customModal
                    ? "Add Custom URL"
                    : `Add ${selectedPlatform?.name}`}
                </h2>

                <button
                  type="button"
                  onClick={resetModal}
                  className="text-[18px] text-black/35 transition hover:text-black/70 dark:text-white/30 dark:hover:text-white/70"
                >
                  ×
                </button>
              </div>

              <div className="relative mt-5 grid h-[34px] grid-cols-2 rounded-full border border-black/[0.08] bg-black/[0.035] p-[2px] dark:border-white/[0.07] dark:bg-black/20">
                <button
                  type="button"
                  onClick={() => setBehavior("link")}
                  className="relative flex items-center justify-center rounded-full text-[9px] font-semibold"
                >
                  {behavior === "link" && (
                    <motion.span
                      layoutId="behavior-active-tab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                        mass: 0.7,
                      }}
                      className="absolute inset-0 rounded-full bg-black/[0.08] dark:bg-[#2a2a2a]"
                    />
                  )}

                  <motion.span
                    transition={{
                      duration: 0.18,
                    }}
                    className={`relative z-10 ${
                      behavior === "link"
                        ? "text-black/80 dark:text-white/80"
                        : "text-black/40 dark:text-white/35"
                    }`}
                  >
                    Link
                  </motion.span>
                </button>

                <button
                  type="button"
                  onClick={() => setBehavior("copy")}
                  className="relative flex items-center justify-center rounded-full text-[9px] font-semibold"
                >
                  {behavior === "copy" && (
                    <motion.span
                      layoutId="behavior-active-tab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                        mass: 0.7,
                      }}
                      className="absolute inset-0 rounded-full bg-black/[0.08] dark:bg-[#2a2a2a]"
                    />
                  )}

                  <motion.span
                    transition={{
                      duration: 0.18,
                    }}
                    className={`relative z-10 ${
                      behavior === "copy"
                        ? "text-black/80 dark:text-white/80"
                        : "text-black/40 dark:text-white/35"
                    }`}
                  >
                    Copy
                  </motion.span>
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border border-black/[0.08] bg-black/[0.025] dark:border-white/[0.07] dark:bg-[#171717]">
                  {customModal &&
                  customIconUrl ? (
                    <img
                      src={customIconUrl}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                  ) : customModal ? (
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      size={17}
                      color="currentColor"
                      className="text-black/70 dark:text-white/70"
                    />
                  ) : selectedPlatform ? (
                    <selectedPlatform.icon
                      size={21}
                      className={
                        selectedPlatform.color === "#FFFFFF"
                          ? "text-black dark:text-white"
                          : undefined
                      }
                      style={
                        selectedPlatform.color === "#FFFFFF"
                          ? undefined
                          : {
                              color: selectedPlatform.color,
                            }
                      }
                    />
                  ) : null}
                </div>

                <div className="flex h-[42px] min-w-0 flex-1 items-center overflow-hidden rounded-full border border-black/[0.08] bg-black/[0.02] dark:border-white/[0.07] dark:bg-black/15">
                  {!customModal &&
                    selectedPlatform?.prefix && (
                      <span className="shrink-0 border-r border-black/[0.08] px-3 text-[10px] text-black/45 dark:border-white/[0.06] dark:text-white/35">
                        {selectedPlatform.prefix}
                      </span>
                    )}

                  <input
                    autoFocus
                    value={value}
                    onChange={(event) =>
                      setValue(
                        event.target.value
                      )
                    }
                    placeholder={
                      customModal
                        ? "https://yoursite.com"
                        : selectedPlatform
                            ?.placeholder
                    }
                    className="min-w-0 flex-1 bg-transparent px-3 text-[10px] text-black/75 outline-none placeholder:text-black/30 dark:text-white/75 dark:placeholder:text-white/20"
                  />
                </div>
              </div>

              {customModal && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="mb-2 text-[9px] font-medium text-black/45 dark:text-white/35">
                      Icon
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={
                        uploadCustomIcon
                      }
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingIcon}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="flex h-[40px] w-full items-center justify-center gap-2 rounded-[12px] border border-black/[0.08] bg-black/[0.02] text-[9px] font-semibold text-black/55 transition hover:bg-black/[0.04] disabled:opacity-40 dark:border-white/[0.07] dark:bg-black/15 dark:text-white/50 dark:hover:bg-white/[0.025]"
                    >
                      {customIconUrl && (
                        <img
                          src={customIconUrl}
                          alt=""
                          className="h-4 w-4 object-contain"
                        />
                      )}

                      {uploadingIcon
                        ? "Uploading..."
                        : customIconUrl
                          ? "Change icon"
                          : "Set icon"}
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 text-[9px] font-medium text-black/45 dark:text-white/35">
                      Label
                    </p>

                    <input
                      value={label}
                      onChange={(event) =>
                        setLabel(
                          event.target.value
                        )
                      }
                      placeholder="Tooltip name"
                      maxLength={128}
                      className="h-[40px] w-full rounded-[12px] border border-black/[0.08] bg-black/[0.02] px-3 text-[10px] text-black/70 outline-none placeholder:text-black/30 dark:border-white/[0.07] dark:bg-black/15 dark:text-white/70 dark:placeholder:text-white/20"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 min-h-[14px] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={behavior}
                    initial={{
                      opacity: 0,
                      y: 4,
                      filter: "blur(3px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -4,
                      filter: "blur(3px)",
                    }}
                    transition={{
                      duration: 0.16,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-[9px] text-black/40 dark:text-white/30"
                  >
                    {behavior === "link"
                      ? "Opens the link in a new tab."
                      : "Copies the value to the visitor's clipboard."}
                  </motion.p>
                </AnimatePresence>
              </div>

              {error && (
                <p className="mt-2 text-[9px] font-medium text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetModal}
                  className="h-[36px] px-3 text-[10px] font-medium text-black/50 transition hover:text-black/75 dark:text-white/45 dark:hover:text-white/70"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    !value.trim() ||
                    saving ||
                    uploadingIcon
                  }
                  onClick={() =>
                    void addLink()
                  }
                  className="h-[36px] min-w-[80px] rounded-[11px] bg-black/80 px-5 text-[10px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white/55 dark:text-black dark:hover:bg-white/70"
                >
                  {saving
                    ? "Adding..."
                    : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SaveBar
        open={hasUnsavedChanges}
        saving={savingSettings}
        onUndo={handleUndoSettings}
        onSave={() =>
          void handleSaveSettings()
        }
      />
    </>
  );
}

function SettingRow({
  title,
  enabled,
  onChange,
}: {
  title: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      whileTap={{
        scale: 0.985,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className="flex min-h-[40px] w-full items-center gap-3 rounded-[12px] border border-black/[0.08] bg-black/[0.02] px-3 text-left transition-colors hover:bg-black/[0.04] dark:border-white/[0.055] dark:bg-black/15 dark:hover:bg-white/[0.02]"
    >
      <motion.span
        animate={{
          scale: enabled ? 1 : 0.96,
        }}
        transition={{
          type: "spring",
          stiffness: 550,
          damping: 32,
        }}
        className={`relative flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[6px] border ${
          enabled
            ? "border-[#2832F9] bg-[#2832F9]"
            : "border-black/[0.14] bg-transparent dark:border-white/[0.12]"
        }`}
      >
        <AnimatePresence initial={false}>
          {enabled && (
            <motion.svg
              key="check"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              initial={{
                opacity: 0,
                scale: 0.3,
                rotate: -20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
                rotate: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 650,
                damping: 28,
              }}
            >
              <motion.path
                d="M5 12.5L9.5 17L19 7.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                exit={{
                  pathLength: 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>

      <motion.span
        transition={{
          duration: 0.18,
        }}
        className={`text-[10px] font-medium ${
          enabled
            ? "text-black/70 dark:text-white/70"
            : "text-black/50 dark:text-white/45"
        }`}
      >
        {title}
      </motion.span>
    </motion.button>
  );
}