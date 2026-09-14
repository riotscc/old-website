export type BadgeIndex = {
  badgeImage: string;
  badgeName: string;
  badgeRoleID: string;
};

export const badges: BadgeIndex[] = [
  {
    badgeImage: "/images/badges/staff.png",
    badgeName: "Staff",
    badgeRoleID: "1548577726426779678",
  },
  {
    badgeImage: "/images/badges/verified.png",
    badgeName: "Verified",
    badgeRoleID: "1548580040248262767",
  },
  {
    badgeImage: "/images/badges/premium.png",
    badgeName: "Premium",
    badgeRoleID: "1548581482539393125",
  },
  {
    badgeImage: "/images/badges/tester.png",
    badgeName: "Tester",
    badgeRoleID: "1548579977182584912",
  },
  {
    badgeImage: "/images/badges/bug-hunter.png",
    badgeName: "Bug Hunter",
    badgeRoleID: "BUG_HUNTER_ROLE_ID",
  },
  {
    badgeImage: "/images/badges/early-supporter.png",
    badgeName: "Early Supporter",
    badgeRoleID: "1548929831373250660",
  },
  {
    badgeImage: "/images/badges/og.png",
    badgeName: "OG",
    badgeRoleID: "1548579895188389908",
  },
  {
    badgeImage: "/images/badges/booster.png",
    badgeName: "Server Booster",
    badgeRoleID: "1548845831371624580",
  },
];

export function getBadgesFromRoleIds(roleIds: string[]) {
  const roleSet = new Set(roleIds);

  return badges.filter((badge) => roleSet.has(badge.badgeRoleID));
}