import { NextRequest, NextResponse } from "next/server";
import {
  getLeaderboardUsers,
  type LeaderboardSort,
} from "@/database/queries/users";
import { getProfileViewCounts } from "@/database/queries/analytics";

const allowedSorts = new Set<LeaderboardSort>([
  "views",
  "likes",
  "followers",
]);

const allowedRanges = new Set([
  "all",
  "30",
  "7",
  "1",
]);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const requestedSort =
      searchParams.get("sort")?.toLowerCase() || "views";

    const requestedRange =
      searchParams.get("range")?.toLowerCase() || "all";

    const sort: LeaderboardSort =
      allowedSorts.has(
        requestedSort as LeaderboardSort
      )
        ? (requestedSort as LeaderboardSort)
        : "views";

    const range = allowedRanges.has(requestedRange)
      ? requestedRange
      : "all";

    const days =
      range === "all"
        ? null
        : Number(range);

    const leaderboard =
      await getLeaderboardUsers(sort);

    const userIds = leaderboard.map(
      (user) => user.id
    );

    const profileViewCounts =
      await getProfileViewCounts(
        userIds,
        days
      );

    const users = leaderboard.map((user) => ({
      id: user.id,
      username: user.username,
      displayName:
        user.globalName ||
        user.username,
      globalName: user.globalName,
      avatar: user.avatar,
      views:
        profileViewCounts.get(user.id) ?? 0,
      likes: user.likes,
      followers: user.followers,
      plan: user.plan,
    }));

    users.sort((a, b) => {
      if (sort === "views") {
        if (b.views !== a.views) {
          return b.views - a.views;
        }
      }

      if (sort === "likes") {
        if (b.likes !== a.likes) {
          return b.likes - a.likes;
        }
      }

      if (sort === "followers") {
        if (b.followers !== a.followers) {
          return b.followers - a.followers;
        }
      }

      return a.username.localeCompare(
        b.username
      );
    });

    return NextResponse.json({
      success: true,
      sort,
      range,
      users,
    });
  } catch (error) {
    console.error(
      "LEADERBOARD_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load leaderboard.",
        users: [],
      },
      {
        status: 500,
      }
    );
  }
}