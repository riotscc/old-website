"use client";

import { useEffect } from "react";

export default function ProfileViewTracker({
    username,
}: {
    username: string;
}) {
    useEffect(() => {
        fetch("/api/analytics/view", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                referrer: document.referrer,
            }),
        }).catch(() => {});
    }, [username]);

    return null;
}