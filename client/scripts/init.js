const Form = (() => {
    const init = () => {
        $('#signin-form').on('submit', (e) => {
            e.preventDefault();

            const username = $('#signin-username').val().trim();
            const password = $('#signin-password').val().trim();

            Authentication.login(username, password, () => {
                window.location.reload();
            }, (error) => $("#signin-message").text(error))

        });

        $('#register-form').on('submit', (e) => {
            e.preventDefault();

            const username = $('#register-username').val().trim();
            const password = $('#register-password').val().trim();
            const confrimPassword = $('#confirm-password').val().trim();

            if (password !== confrimPassword) {
                $('#register-message').text("Passwords do not match");
                return;
            }

            Authentication.register(username, password, () => {
                window.location.reload();
            }, (error) => $("#register-message").text(error));
        })
    }
    return { init };
})();