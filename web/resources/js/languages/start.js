function start () {
    startContent.init();
}

let startContent = new function () {
    let olimpParts = {
        "немецкий" : [
            "вставить слова и словосочетания в пропуски в тексте",
            "аудирование, 10 вопросов с 2 вариантами ответов",
            "перевод текста"
        ],
        "английский" : [
            "watch the video and mark the statements true or false",
            "read the text and check the sentences",
            "translate the text"
        ],
        "русский" : [
            "тест на 10 вопросов",
            "Эссе",
            "-"
        ]
    };
    let srcs = {
        "английский" : "/languages/english",
        "русский" : "/languages/russian",
        "немецкий" : "/languages/german"
    };
    let isSend = false;
    let instructionSend = false;

    function init () {
        needLanguages = ["русский", "английский"];
        addEvents();
        checkbox.init();

        getInfo();
    }

    function getInfo () {
        try {
            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/start',
                type: 'POST',
                dataType: 'html',
                data: "t=info",
                error: function (req, text, error) {
                    alert("Ошибка: " + error);
                    console.error('Упс! Ошибочка: ' + text + ' | ' + error);
                },
                success: function (dataGet, status) {
                    try {
                        console.log(dataGet);

                        let data = JSON.parse( dataGet );

                        if ( !data.hasOwnProperty( "status" ) ) {
                            alert( "Битый ответ сервера. Попробуйте ещё раз." );

                            return;
                        }

                        if ( data[ "status" ] === "ok" ) {
                            $( "#cHeader > span" ).html( data[ "registerKey" ] );

                            if ( data[ "russian" ] !== "on" ) {
                                switch ( data[ "russian" ] ) {
                                    case "off" :
                                        checkbox.off( "русский" );
                                        break;
                                    case "end" :
                                        checkbox.end( "русский" );
                                }
                            }
                            else {
                                checkbox.addNeedLanguages();
                            }

                            if ( data[ "english" ] !== "on" ) {
                                switch ( data[ "english" ] ) {
                                    case "off" :
                                        checkbox.off( "английский" );
                                        break;
                                    case "end" :
                                        checkbox.end( "английский" );
                                }
                            }
                            else {
                                checkbox.addNeedLanguages();
                            }

                            if ( data[ "german" ] !== "on" ) {
                                switch ( data[ "german" ] ) {
                                    case "off" :
                                        checkbox.off( "немецкий" );
                                        break;
                                    case "end" :
                                        checkbox.end( "немецкий" );
                                }
                            }
                            else {
                                checkbox.addNeedLanguages();
                            }

                            $( "body" ).removeClass( "bodyBlock" );

                            return;
                        }

                        if ( data[ "status" ] === "error" || data[ "status" ] === "no" ) {
                            alert( data[ "errorText" ] );

                            return;
                        }

                        alert( "Неизвестный ответ от сервера. Попробуйте ещё раз." );
                    }
                    catch ( err ) {
                        console.log( err );
                        alert( "Возникла ошибка: " + err );
                    }
                }
            });
        }
        catch ( err ) {
            console.log( err );
            alert( "Не удалось загрузить информацию, попробуйте ещё раз" );
        }
    }

    function addEvents () {
        try {
            $("#cBCreate").on("click", goToCreator);
            $("#cBTest").on("click", goToTestOlimp);
            $( "#cBStart" ).on( "click", go );
            $( "#cHExit" ).on( "click", exit );
            $( "#Instruction" ).on( "click", downloadInstruction );
        }
        catch ( err ) {
            console.log( err );
        }
    }
    function goToCreator(){
        try {
            window.open( "/languages/testCreator", "_parent" );
        }
        catch ( err ) {
            console.log( err );
        }
    }
    function goToTestOlimp(){
        try {
            window.open( "/languages/testTesting", "_parent" );
        }
        catch ( err ) {
            console.log( err );
        }
    }




    function downloadInstruction() {
        try{
            if (instructionSend){
                return;
            }

            instructionSend = true;

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/start',
                type: 'POST',
                dataType: 'html',
                data: "t=instruction",
                error: function (req, text, error) {
                    alert("Ошибка: " + error);
                    console.error('Упс! Ошибочка: ' + text + ' | ' + error);

                    instructionSend = false;
                },

            });
        }
        catch (err) {
            console.log(err);

            instructionSend = false;
        }
    }

    function exit () {
        try {
            setCookie( "tok", "", {
                expires : -1,
                path : "/"
            } );

            location.href = "https://olimp.sgugit.ru/languages/testCreator";
        }
        catch ( err ) {
            console.log( err );

            isSend = false;
        }
    }

    function go () {
        try {
            if ( isSend ) {
                return;
            }

            isSend = true;

            if ( !checkbox.check () || !confirm( "Предупреждение, после начала олимпиаду нельзя остановить!\nВо время выполнения НЕ ОБНОВЛЯЙТЕ страницу!\nНачать олимпиаду?" ) ) {
                isSend = false;

                return;
            }

            let lang = checkbox.getSelectLang();

            if ( lang === false ) {
                isSend = false;

                return;
            }

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/start',
                type: 'POST',
                dataType: 'html',
                data: "t=start&l=" + encodeURI( lang ),
                error: function (req, text, error) {
                    alert("Ошибка: " + error);
                    console.error('Упс! Ошибочка: ' + text + ' | ' + error);

                    isSend = false;
                },
                success: function (dataGet, status) {
                    try {
                        console.log(dataGet);

                        let data = JSON.parse( dataGet );

                        if ( !data.hasOwnProperty( "status" ) ) {
                            alert( "Битый ответ сервера. Попробуйте ещё раз." );
                            isSend = false;

                            return;
                        }

                        if ( data[ "status" ] === "ok" ) {
                            window.open( srcs[ lang ], "_parent" );

                            return;
                        }

                        if ( data[ "status" ] === "error" || data[ "status" ] === "no" ) {
                            alert( data[ "errorText" ] );
                            isSend = false;

                            return;
                        }

                        alert( "Неизвестный ответ от сервера. Попробуйте ещё раз." );
                        isSend = false;
                    }
                    catch ( err ) {
                        console.log( err );
                        alert( "Возникла ошибка: " + err );

                        isSend = false;
                    }
                }
            });
        }
        catch ( err ) {
            console.log( err );

            isSend = false;
        }
    }

    function setParts ( language ) {
        try {
            if ( language === null || language === undefined ) {
                return
            }

            if ( language === false ) {
                $( ".cPItem > span" ).html( "-" );

                return;
            }

            if ( !olimpParts.hasOwnProperty( language ) ) {
                return;
            }

            $( ".cPItem > span" ).html( "" );

            for ( let i = 1; i <= 3; i++ ) {
                if ( !olimpParts[ language ].hasOwnProperty( i - 1 )  ) {
                    $( "#cP" + i + " > span" ).html( "-" );

                    break;
                }
                $( "#cP" + i + " > span" ).html( olimpParts[ language ][ i - 1 ] );
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function setCookie(name, value, options) {
        options = options || {};

        let expires = options.expires;

        if (typeof expires == "number" && expires) {
            let d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        let updatedCookie = name + "=" + value;

        for (let propName in options) {
            updatedCookie += "; " + propName;
            let propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    return {
        init: function () {
            init();
        },
        setParts: function (language) {
            setParts(language);
        }
    }
};

let checkbox = new function () {
    let needLanguages = 0;

    function init () {
        try {
            addEvents();
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

                startContent.setParts( false );
            }
            else {
                $( ".rCBox" ).removeClass( "rCBoxSelect" );
                $( box ).addClass( "rCBoxSelect" );

                startContent.setParts( $( e.currentTarget ).attr( "data-val" ) )
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function changeStatusByValue ( value, status ) {
        try {
            if ( value === null || value === undefined ) {
                value = false;
            }
            if ( status === null || status === undefined ) {
                status = false;
            }

            if ( value.length < 4 || status !== "off" && status !== "end" ) {
                return;
            }

            $( ".rCheckbox" ).each( function ( index, elem ) {
                if ( $( elem ).attr( "data-val" ) === value ) {
                    $( elem ).addClass( status === "off" ? "rCheckboxOff" : "rCheckboxEnd" ).off( "click" );
                    $( ".rCBox", elem ).removeClass( "rCBoxSelect" );
                }
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function getSelectLang ( ) {
        try {
            let lang = "";

            $( ".rCheckbox" ).each( function ( index, elem ) {
                let selectBox = $( ".rCBoxSelect", elem );

                if ( selectBox.length === 1 ) {
                    lang = $( selectBox ).parent( ".rCheckbox" ).attr( "data-val" );
                }
            } );

            return lang === "" || lang.length === 0 ? false : lang;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function check () {
        try {
            //ТУТ КОЛИЧЕСТВО ВЫБРАННЫХ ЯЗЫКОВ и КАКИХ
            //СРАВНИВАЕТСЯ С ЯЗЫКАМИ и ИХ КОЛИЧЕСТВОМ, ЧТО НА САЙТЕ ВЫБРАНО
            let endLanguages = 0;
            let availableLanguages = 0;
            let selectLanguages = 0;

            $( ".rCheckbox" ).each( function ( index, elem ) {
                if ( $( elem ).hasClass( "rCheckboxEnd" ) ) {
                    endLanguages++;
                }

                if ( !$( elem ).hasClass( "rCheckboxOff" ) ) {
                    availableLanguages++;
                }

                if ( $( ".rCBoxSelect", elem ).length === 1 ) {
                    selectLanguages++;
                }
            } );

            if ( endLanguages.length === needLanguages ) {
                alert( "Вы уже выполнили все, ранее выбранные, олимпиады, ожидайте результаты." );

                return false;
            }

            if ( availableLanguages > 0 && selectLanguages === 0 ) {
                alert( "Необходимо выбрать язык" );

                return false;
            }

            if ( selectLanguages > 1 ) {
                alert( "Необходимо выбрать один язык" );

                return false;
            }

            return true;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addNeedLanguages () {
        try {
            needLanguages++;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    return {
        init: function () {
            init();
        },
        off: function ( value ) {
            changeStatusByValue ( value, "off" );
        },
        end: function ( value ) {
            changeStatusByValue ( value, "end" );
        },
        getSelectLang: function () {
            return getSelectLang ();
        },
        check: function () {
            return check ();
        },
        addNeedLanguages: function () {
            addNeedLanguages ();
        }
    }
};

$( start );