import { notFound } from "next/navigation";
import connectPostgres from "@/lib/postgres";
import ProfileViewTracker from "./ProfileViewTracker";

const pool = connectPostgres();

type PageProps = {
    params: Promise<{
        username: string;
    }>;
};

async function getUser(username: string) {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            global_name,
            avatar,
            bio,
            likes,
            followers,
            availability,
            plan
        FROM users
        WHERE LOWER(username) = LOWER($1)
        LIMIT 1
        `,
        [username]
    );

    if (!result.rowCount) {
        return null;
    }

    const user = result.rows[0];

    const viewsResult = await pool.query(
        `
        SELECT COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        `,
        [user.id]
    );

    return {
        ...user,
        views: viewsResult.rows[0]?.views ?? 0,
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { username } = await params;

    const user = await getUser(username);

    if (!user) {
        notFound();
    }

    const displayName = user.global_name || user.username;

    return (
        <main className="flex min-h-svh items-center justify-center bg-black px-6 text-white">
            <ProfileViewTracker username={user.username} />

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <h1 className="mt-5 text-3xl font-bold tracking-tight">
                        {displayName}
                    </h1>

                    <p className="mt-1 text-sm text-white/45">
                        @{user.username}
                    </p>

                    {user.bio && (
                        <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                            {user.bio}
                        </p>
                    )}

                    <div className="mt-6 flex items-center gap-6 text-sm text-white/50">
                        <span>
                            {Number(user.views).toLocaleString()} views
                        </span>

                        <span>
                            {Number(user.likes ?? 0).toLocaleString()} likes
                        </span>

                        <span>
                            {Number(user.followers ?? 0).toLocaleString()} followers
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}