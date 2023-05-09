const Leaderboard = (() => {
    const url = `http://localhost:8000/leaderboard/`;

    const getLeaderboard = async (onError) => {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!res.ok) {
            const txt = await res.json();
            return onError(txt.msg);
        }

        return await res.json();
    }

    const updateLeaderboard = async (username, score, onError) => {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, score: score })
        });

        if (!res.ok) {
            const txt = await res.json();
            return onError(txt.msg);
        }

        return await res.json();
    }

    return { getLeaderboard, updateLeaderboard };
})();