const Room = (() => {

    const url = `http://localhost:8000/room`;

    const getRooms = async (onSuccess, onError) => {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            const txt = await res.json();
            return onError(txt.msg);
        }

        const rooms = await res.json();
        onSuccess(rooms);
    }

    const createRoom = async (room, onSuccess, onError) => {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: room })
        })

        if (!res.ok) {
            const txt = await res.json();
            return onError(txt.msg);
        }

        onSuccess();
    }

    return { getRooms, createRoom };

})();