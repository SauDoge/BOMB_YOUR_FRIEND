const Form = (() => {
    const init = () => {

        $('#signin-form').on('submit', (e) => {
            e.preventDefault();

            const username = $('#signin-username').val().trim();
            const password = $('#signin-password').val().trim();

            Authentication.login(username, password, () => {
                document.cookie = `user=${username}`;
                // onSuccess:
                // 1) disable the sign-in tab
                // 2) enable the sign-in successful and sign-out tab
                $('#signin-register').hide();
                $('#sign-in-name').text(username);
                $('#signout-column').show();

                // window.location.reload();
            }, (error) => $("#signin-message").text(error))

        });

        $('#register-form').on('submit', (e) => {
            e.preventDefault();

            const username = $('#register-username').val().trim();
            const password = $('#register-password').val().trim();
            const confrimPassword = $('#register-confirm').val().trim();

            if (password !== confrimPassword) {
                $('#register-message').text("Passwords do not match");
                return;
            }

            Authentication.register(username, password, () => {
                window.location.reload();
            }, (error) => $("#register-message").text(error));
        });

        $('#logout-form').on('submit', (e) => {
            console.log("logged out");
            $('#signin-register').show();
            $('#signout-column').hide();
        });


        $('#group-form').on('submit', (e) => {
            e.preventDefault();

            const room = $('#room-name').val().trim();
            Room.createRoom(room, () => {
                window.location.reload();
            }, (error) => $('#create-room-message').text(error));
        });

    }
    return { init };
})();