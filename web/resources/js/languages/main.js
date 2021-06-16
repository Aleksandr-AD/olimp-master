function start () {
    reg.init();
}

let reg = new function () {
    let isReg = false;

    function init () {
        try {
            addEvents ();
            checkbox.init();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents () {
        try {
            $( "#rBStart" ).on( "click", goToStartPage );
            $( "#rBReg" ).on( "click", registr );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function registr ( e ) {
        try {
            if ( isReg ) {
                return;
            }

            isReg = true;

            if ( !check () || !confirm( "Помните, что зарегистрироваться можно только один раз.\nЕсли вы уже зарегистрированы, нажмите на кнопку \"Уже зарегистрирован\".\nВ случае повторного прохождении олимпиады учитываются только первые результаты.\nПродолжить?" ) ) {
                isReg = false;

                return;
            }
            //поля ввода студента
            let n = $( "#rIN" ).val();
            let f = $( "#rIF" ).val();
            let o = $( "#rIO" ).val();
            let t = $( "#rIT" ).val();
            let u = $( "#rIU" ).val();
            let s = $( "#rIS" ).val();
            let i = $( "#rIIF" ).val();
            let g = $( "#rIG" ).val();
            let m = $( "#rMail" ).val();
            let p = $( "#rPhone" ).val();
            let ps = $( "#pass" ).val();
            let rPs = $( "#rePass" ).val();

            //поля ввода преподавателя
            let pFn = $( "#prFName" ).val();
            let pLn = $( "#prLName" ).val();
            let pPa = $( "#prPatronymic" ).val();
            let pPo = $( "#prPosition" ).val();
            let pMa = $( "#prMail" ).val();
            let pPh = $( "#prPhone" ).val();

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages',
                type: 'POST',
                dataType: 'html',
                data: "n=" + encodeURI( n ) + "&f=" + encodeURI( f ) + "&o=" + encodeURI( o ) + "&t=" + encodeURI( t ) + "&u=" + encodeURI( u ) + "&s=" + encodeURI( s ) + "&i=" + encodeURI( i ) + "&g=" + encodeURI( g ) + "&m=" + encodeURI( m ) + "&p=" + encodeURI( p ) + "&ps=" + encodeURI( ps ) + "&rPs=" + encodeURI( rPs ) + "&pFn=" + encodeURI( pFn ) + "&pLn=" + encodeURI( pLn ) + "&pPa=" + encodeURI( pPa ) + "&pPo=" + encodeURI( pPo ) + "&pMa=" + encodeURI( pMa ) + "&pPh=" + encodeURI( pPh ) + "&l=" + encodeURI( checkbox.getCheckLanguagesStr() ),
                error: function (req, text, error) {
                    alert("Ошибка: " + error);
                    console.error('Упс! Ошибочка: ' + text + ' | ' + error);

                    isReg = false;
                },
                success: function (dataGet, status) {
                    try {
                        console.log(dataGet);

                        let data = JSON.parse( dataGet );

                        if ( !data.hasOwnProperty( "status" ) ) {
                            alert( "Битый ответ сервера. Попробуйте ещё раз." );
                            isReg = false;

                            return;
                        }

                        if ( data[ "status" ] === "ok" ) {
                            alert( "Регистрация прошла успешно.\n*ВАШ РЕГИСТРАЦИОННЫЙ НОМЕР " + data[ "registrationKey" ] + ".*\n Вам на почту выслано письмо с подтверждением почты" );

                            window.open( "/languages/start", "_parent" );

                            return;
                        }

                        if ( data[ "status" ] === "error" ) {
                            alert( data[ "errorText" ] );
                            isReg = false;

                            return;
                        }

                        if ( data[ "status" ] === "no" ) {
                            alert( "Вы уже регистрировались. Проидйте авторизацию, кнопка \"Уже зарегистрирован\"" );
                            isReg = false;

                            return;
                        }

                        alert( "Неизвестный ответ от сервера. Попробуйте ещё раз." );
                        isReg = false;
                    }
                    catch ( err ) {
                        console.log( err );
                        alert( "Возникла ошибка: " + err );

                        isReg = false;
                    }
                }
            });
        }
        catch ( err ) {
            console.log( err );
        }
        finally {
            isReg = false;
        }
    }

    function check () {
        try {
            // Обработка полей студента
            let n = $( "#rIN" ).val();

            if ( !/^[а-яёА-ЯЁ]{2,}$/.test( n ) ) {
                alert( "Поле \"Имя\" заполнено неверно" );

                return false
            }

            let f = $( "#rIF" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-]*[а-яёА-ЯЁ]{1,}$/.test( f ) ) {
                alert( "Поле \"Фамилия\" заполнено неверно" );

                return false
            }

            let o = $( "#rIO" ).val();

            if ( !/^[а-яёА-ЯЁ]{2,}$/.test( o ) ) {
                alert( "Поле \"Отчество\" заполнено неверно" );

                return false
            }

            let t = $( "#rIT" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-]*[а-яёА-ЯЁ]{1,}$/.test( t ) ) {
                alert( "Поле \"Город\" заполнено неверно" );

                return false
            }

            let u = $( "#rIU" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-\s]*[а-яёА-ЯЁ]{1,}$/.test( u ) ) {
                alert( "Поле \"Университет\" заполнено неверно" );

                return false
            }
            // if ( $( "#isLKuser" ).length !== 1 && (u.toLowerCase() === "сгугит" || u.toLowerCase() === "сибирский государственный университет геосистем и технологий") ) {
            //     alert("Обучающиеся СГУГиТ регистрируются через свой личный кабинет на https://lk.sgugit.ru!!!");
            //
            //     return false;
            // }

            let s = $( "#rIS" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-\s]*[а-яёА-ЯЁ]{1,}$/.test( s ) ) {
                alert( "Поле \"Направление (специальность)\" заполнено неверно" );

                return false
            }

            let i = $( "#rIIF" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-\s/]*[а-яёА-ЯЁ]{1,}$/.test( i ) ) {
                alert( "Поле \"Институт/Факультет\" заполнено неверно" );

                return false
            }

            let g = $( "#rIG" ).val();

            if ( !/^[а-яёА-ЯЁ0-9\-\s].{1,}$/.test( g ) ) {
                alert( "Поле \"№ Группы\" заполнено неверно" );

                return false
            }

            let m = $( "#rMail" ).val();

            if ( !/.{2,}@.{2,}\.[a-z]{1,}/.test( m ) ) {
                alert( "Поле \"Адрес эл.почты\" заполнено неверно" );

                return false
            }

            let p = $( "#rPhone" ).val();

            if ( !/\d{10}/.test( p ) ) {
                alert( "Поле \"Номер телефона\" заполнено неверно" );

                return false
            }
            //пароль
            let ps = $( "#pass" ).val();

            if ( !/[a-z0-9_@!]{4,}/.test( ps ) ) {
                alert( "Неправилный пароль!\" Пароль должен состоять минимум из 4 символов!" );

                return false
            }

            //проверка пароля
            let rPs = $( "#rePass" ).val();

            if ( !(ps === rPs) ) {
                alert( "Пароль должен совпадать!" );

                return false
            }



            //Обработка поле преподавателя
            let pFn = $( "#prFName" ).val();

            if ( !/^[а-яёА-ЯЁ]{2,}$/.test( pFn ) ) {
                alert( "Поле \"Имя(преподователя)\" заполнено неверно" );

                return false
            }

            let pLn = $( "#prLName" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-]*[а-яёА-ЯЁ]{1,}$/.test( pLn ) ) {
                alert( "Поле \"Фамилия(преподователя)\" заполнено неверно" );

                return false
            }

            let pPa = $( "#prPatronymic" ).val();

            if ( !/^[а-яёА-ЯЁ]{2,}$/.test( pPa ) ) {
                alert( "Поле \"Отчество(преподователя)\" заполнено неверно" );

                return false
            }

            let pPo = $( "#prPosition" ).val();

            if ( !/^[а-яёА-ЯЁ]{1,}[а-яёА-ЯЁ\-\s]*[а-яёА-ЯЁ]{1,}$/.test( pPo ) ) {
                alert( "Поле \"Должность\" заполнено неверно" );

                return false
            }

            let pMa = $( "#prMail" ).val();

            if ( !/.{2,}@.{2,}\.[a-z]{1,}/.test( pMa ) ) {
                alert( "Поле \"Адрес эл.почты\" заполнено неверно" );

                return false
            }

            let pPh = $( "#prPhone" ).val();

            if ( !/\d{10}/.test( pPh ) ) {
                alert( "Поле \"Номер телефона\" заполнено неверно" );

                return false
            }
            //--------------------------

            let selectLanguagesCount = $( ".rCBox.rCBoxSelect" ).length;

            if ( selectLanguagesCount === 0 ) {
                alert( "Необходимо выбрать хотя бы один язык" );

                return false;
            }

            return true;
        }
        catch ( err ) {
            console.log( err );
            alert( err );

            return false;
        }
    }

    function goToStartPage ( e ) {
        try {
            window.open( "/languages/start", "_parent" );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    return {
        init : function () {
            init ();
        }
    }
};

let checkbox = new function () {

    function init () {
        try {
            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents () {
        try {
            $( ".rCheckbox" ).on( "click", click );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function click ( e ) {
        try {
            let box = $( ".rCBox", e.currentTarget );

            if ( $( box ).hasClass( "rCBoxSelect" ) ) {
                $( box ).removeClass( "rCBoxSelect" );
            }
            else {
                $( box ).addClass( "rCBoxSelect" );
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function getCheckLanguagesStr () {
        try {
            let str = "";

            $( ".rCBox.rCBoxSelect" ).each( function ( index, box ) {
                str += "," + $( box ).parent( ".rCheckbox" ).attr( "data-val" );
            } );

            str = str.substring( 1 );

            return str;
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    return {
        init: function () {
            init();
        },
        getCheckLanguagesStr: function () {
            return getCheckLanguagesStr();
        }
    }
};

$( start );