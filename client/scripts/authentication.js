const Authentication = (() => {

    const url = (auth) => {
        return `http://localhost:3000/auth/${auth}`;
    }

    const sendAuth = async (username, password, endpoint, onSuccess, onError) => {
        const auth = url(endpoint);

        const res = await fetch(auth, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        })

        if (!res.ok) {
            const txt = await res.json();
            return onError(txt.msg);
        }

        onSuccess();
    }


    const register = async (username, password, onSuccess, onError) => {
        sendAuth(username, password, "register", onSuccess, onError);
    }

    const login = async (username, password, onSuccess, onError) => {
        sendAuth(username, password, "login", onSuccess, onError);
    }

    return { register, login }
})();