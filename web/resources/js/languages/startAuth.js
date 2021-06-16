function startAuth () {
    startAuthContent.init();
}

let startAuthContent = new function () {
    let isAuth = false;

    function init () {
        addEvents ();
    }

    function addEvents () {
        try {
            $( "#cBStart" ).on( "click", enter );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function enter ( e ) {
        try {
            if ( isAuth ) {
                return;
            }

            isAuth = true;

            if ( !check() ) {
                return;

                isAuth = false;
            }

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/start',
                type: 'POST',
                dataType: 'html',
                data: "t=auth&k=" + $( "#cK" ).val() + "&s=" + $( "#cS" ).val(),
                error: function (req, text, error) {
                    alert("Ошибка: " + error);
                    console.error('Упс! Ошибочка: ' + text + ' | ' + error);

                    isAuth = false;
                },
                success: function (dataGet, status) {
                    try {
                        document.cookie = "userId=" + $( "#cK" ).val();
                        console.log(dataGet);

                        let data = JSON.parse( dataGet );

                        if ( !data.hasOwnProperty( "status" ) ) {
                            alert( "Битый ответ сервера. Попробуйте ещё раз." );
                            isAuth = false;

                            return;
                        }

                        if ( data[ "status" ] === "ok" ) {
                            window.open( "/languages/start", "_parent" );

                            return;
                        }

                        if ( data[ "status" ] === "errorEnterData" || data[ "status" ] === "error" || data[ "status" ] === "no" ) {
                            alert( data[ "errorText" ] );
                            isAuth = false;

                            return;
                        }

                        alert( "Неизвестный ответ от сервера. Попробуйте ещё раз." );

                        isAuth = false;
                    }
                    catch ( err ) {
                        console.log( err );
                        alert( "Возникла ошибка: " + err );

                        isAuth = false;
                    }
                }
            });
        }
        catch ( err ) {
            console.log( err );

            isAuth = false;
        }
    }

    function check ( ) {
        try {
            let key = $( "#cK" ).val();

            if ( !/^[0-9]{1,}$/.test( key ) || parseInt( key ) <= 0 ) {
                alert( "Неверный формат регистарционного номера" );

                return false;
            }

            let pass = $( "#cS" ).val();

            if (!/[a-z0-9_@!]{4,}/.test( pass )) {
                alert( "Пароль неверного формата" );

                return false;
            }

            return true;
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    return {
        init: function () {
            init();
        }
    }
};

$( startAuth );