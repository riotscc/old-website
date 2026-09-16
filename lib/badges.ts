export type BadgeIndex = {
  badgeId: string
  badgeImage: string
  badgeName: string
  badgeRoleID: string
}

export const badges: BadgeIndex[] = [
  {
    badgeId: "official",
    badgeImage: "/images/badges/owners.png",
    badgeName: "Carts.lol Official",
    badgeRoleID: "1548548598201974824",
  },
  {
    badgeId: "manager",
    badgeImage: "/images/badges/manager.png",
    badgeName: "Manager",
    badgeRoleID: "1548843295906734191",
  },
  {
    badgeId: "staff",
    badgeImage: "/images/badges/staff.png",
    badgeName: "Staff",
    badgeRoleID: "1548577726426779678",
  },
  {
    badgeId: "verified",
    badgeImage: "/images/badges/verified.png",
    badgeName: "Verified",
    badgeRoleID: "1548580040248262767",
  },
  {
    badgeId: "premium",
    badgeImage: "/images/badges/premium.png",
    badgeName: "Premium",
    badgeRoleID: "1548581482539393125",
  },
  {
    badgeId: "tester",
    badgeImage: "/images/badges/tester.png",
    badgeName: "Tester",
    badgeRoleID: "1548579977182584912",
  },
  {
    badgeId: "bug-hunter",
    badgeImage: "/images/badges/bug-hunter.png",
    badgeName: "Bug Hunter",
    badgeRoleID: "BUG_HUNTER_ROLE_ID",
  },
  {
    badgeId: "early-supporter",
    badgeImage: "/images/badges/early-supporter.png",
    badgeName: "Early Supporter",
    badgeRoleID: "1548929831373250660",
  },
  {
    badgeId: "og",
    badgeImage: "/images/badges/og.png",
    badgeName: "OG",
    badgeRoleID: "1548579895188389908",
  },
  {
    badgeId: "server-booster",
    badgeImage: "/images/badges/booster.png",
    badgeName: "Server Booster",
    badgeRoleID: "1548845831371624580",
  },
]

export function getBadgesFromRoleIds(roleIds: string[]) {
  const roleSet = new Set(roleIds)

  return badges.filter((badge) =>
    roleSet.has(badge.badgeRoleID)
  )
}