const getUsername = () => {
    const user = document.cookie;

    if (!user)
        return "";

    const [_, username] = user.split('=');
    return username;
}

export { getUsername };