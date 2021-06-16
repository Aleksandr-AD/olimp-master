function startRussian () {
  russian.init();
}

let russian = new function () {
    let partNumber = 1;
    let maxPartNumber = 2;
    let parts = [
        [
            {
                "quest" : "«Малый разговор» в деловой коммуникации ведется в рамках:<br/><br/>",
                "answers" : [
                    "Деловых интересов партнеров",
                    "Профессиональных интересов партнеров",
                    "Личностных, неделовых интересов партнеров"
                ]
            },
            {
                "quest" : "В ценностно-ориентированных манипулятивных технологиях делового общения мишенью психологического воздействия являются:",
                "answers" : [
                    "Духовные идеалы партнера-адресата",
                    "Потребности и склонности партнера-адресата",
                    "Ценностные установки партнера-адресата"
                ]
            },
            {
                "quest" : "Все люди делятся на:",
                "answers" : [
                    "Все ответы верны",
                    "Рациональных и иррациональных",
                    "Сенсориков и интуитов"
                ]
            },
            {
                "quest" : "К механизмам манипулятивного воздействия относятся:",
                "answers" : [
                    "Механизмы присоединения и внедрения, которые использует манипулятор",
                    "Потребности, склонности, мотивации адресата манипуляции",
                    "Психические автоматизмы и комплексы адресата манипуляции"
                ]
            },
            {
                "quest" : "К открытым вопросам в деловой коммуникации относятся:",
                "answers" : [
                    "Альтернативные",
                    "Зеркальные",
                    "Риторические"
                ]
            },
            {
                "quest" : "Персональная дистанция в процессе общения в настоящий момент:",
                "answers" : [
                    "120-350см",
                    "150-170 см",
                    "50-120см"
                ]
            },
            {
                "quest" : "Прочитайте фразу-ответ на входящий телефонный звонок. Оцените как воспринимает клиент фразу. Если Вы считаете, что фраза положительно воспринимается клиентом, ответьте «положительно», а если отрицательно, то ответьте «отрицательно», если «нейтрально», то ответьте «нейтрально».<br/> " +
                    "«Доброе утро, страховая компания «Каскад»",
                "answers" : [
                    "Отрицательно",
                    "Положительно",
                    "Нейтрально"
                ]
            },
            {
                "quest" : "Прием направленного критического слушания целесообразно использовать в деловых ситуациях, связанных с:",
                "answers" : [
                    "«Прочтением» стенических эмоций партнеров",
                    "Выслушиванием жалоб клиентов",
                    "Дискуссионным обсуждением проблем"
                ]
            },
            {
                "quest" : "Проксемическими характеристиками невербального общения являются:",
                "answers" : [
                    "Дистанция между общающимися",
                    "Похлопывание по спине",
                    "Угол общения партнеров"
                ]
            },
            {
                "quest" : "Прочитайте фразу-ответ на входящий телефонный звонок. Оцените как воспринимает клиент фразу. Если Вы считаете, что фраза положительно воспринимается клиентом, ответьте «положительно», а если отрицательно, то ответьте «отрицательно», если нейтрально, то ответьте «нейтрально». <br/><br/>" +
                    "«Боюсь Вас расстроить, но Анна еще обедает. Чем я могу Вам помочь?»",
                "answers" : [
                    "Отрицательно",
                    "Положительно",
                    "Нейтрально"
                ]
            }
        ],
        {
            "textHead" : 'Напишите аналитическое эссе на тему «Физики, инженеры, гуманитарии, мечтатели…кого и когда ждут «умные города»?» <br/><br/>' +
                'Стандартный набор требований к написанию эссе:<br/>' +
                '1. Актуальность проблемы - мнение должно быть доказательным.<br/>' +
                '2. Тезис - вам нужно четко сформулировать тезис, который вы хотите или одобрить, или же опровергнуть.<br/>' +
                '3. Объяснение сути данного тезиса.<br/>' +
                '4. Личное отношение к нему. <br/>' +
                '5. Вывод.<br/>',
            "min" : 10,
            "max" : 600,
            "lang" : "rus"
        }
    ];
    let isSend = false;

    function init () {
        try {
            $( "#testHeader > span" ).html( "Олимпиада по русскому языку 2020" );
            buildFirstPart ();
            timer.init( parseInt( $( "#timerHeader" ).attr( "data-val" ) ), 0 );
            timer.start();

            addEvents ();
        }
        catch ( err ) {
            console.log();
        }
    }

    function addEvents () {
        try {
            $( window ).on( "endTest", endTest );
            $( "#bBBtn" ).on( "click", nextPart );
        }
        catch ( err ) {
            console.log();
        }
    }

    function nextPart () {
        try {
            if ( partNumber === 1 && !checkFirstPart () || partNumber === 2 && !checkSecondPart() ) {
                return;
            }

            if ( !confirm( "Вернуться и поменять ответы будет невозможно, продолжить?" ) ) {
                return;
            }

            let res = "";

            if ( partNumber === 1 ) {
                res = resultFirstPart();
            }
            if ( partNumber === 2 ) {
                res = resultSecondPart();
            }

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/russian',
                type: 'POST',
                dataType: 'html',
                data: "r=" + res + "&p=" + partNumber,
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
                            partNumber++;

                            if ( partNumber === maxPartNumber ) {
                                $( "#bBBtn" ).off( "click", nextPart ).on( "click", end );
                                $( "#bBBtn > span" ).html( "Сохранить и завершить олимпиаду" );
                            }

                            if ( partNumber === 2 ) {
                                buildSecondPart();
                            }

                            if ( partNumber === 3 ) {
                                buildThreePart();
                            }

                            isSend = false;

                            return;
                        }

                        if ( data[ "status" ] === "error" ) {
                            alert( data[ "errorText" ] );
                            isSend = false;

                            return;
                        }

                        if ( data[ "status" ] === "no" ) {
                            if ( partNumber === 1 || partNumber === 2 ) {
                                alert("Вы уже выполнили " + partNumber + " часть, сейчас будете перенаправлены на следующую.");

                                partNumber++;

                                if ( partNumber === maxPartNumber ) {
                                    $( "#bBBtn" ).off( "click", nextPart ).on( "click", end );
                                    $( "#bBBtn > span" ).html( "Сохранить и завершить олимпиаду" );
                                }

                                if ( partNumber === 2 ) {
                                    buildSecondPart();
                                }

                                if ( partNumber === 3 ) {
                                    buildThreePart();
                                }
                            }
                            else {
                                alert("Вы уже выполнили " + partNumber + " часть.");

                                endTest( false );
                            }
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
            console.log();
        }
    }

    function buildFirstPart() {
        try {
            $( "#pFirst" ).remove();
            $( "#partHeader > span" ).html( "ЧАСТЬ I" );
            $( "#part" ).append( '<div id="pFirst"></div>' );

            testing.init( $( "#pFirst" ), parts[partNumber - 1] );
            lineStatus.init ( parts[ partNumber - 1 ].length );
        }
        catch ( err ) {
            console.log();
        }
    }
    function checkFirstPart () {
        try {
            return testing.check();
        }
        catch ( err ) {
            console.log();

            false;
        }
    }
    function resultFirstPart () {
        try {
            return testing.results();
        }
        catch ( err ) {
            console.log();

            false;
        }
    }

    function buildSecondPart () {
        try {
            $( "#pFirst" ).remove();
            $( "#partHeader > span" ).html( "ЧАСТЬ II" );
            $( "#part" ).append( '<div id="pThree"><div id="textHead">\n' +
                '                    ' + parts[ partNumber - 1 ][ "textHead" ] + '\n' +
                '                </div>\n' +
                '\n' +
                '                <div id="textWords">\n' +
                '                    <div id="tWNeed">\n' +
                '                        Объём работы - от<span id="tWNFrom">' + parts[ partNumber - 1 ][ "min" ] + '</span>до<span id="tWNTo">' + parts[ partNumber - 1 ][ "max" ] + '</span>слов.\n' +
                '                    </div>\n' +
                '\n' +
                '                    <div id="tWCurrent">\n' +
                '                        Количество слов:<span>27</span>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '\n' +
                '                <textarea id="textText"></textarea></div>' );
            text.init( $( "#textText" ), $( "#tWCurrent > span" ), parts[ partNumber - 1 ][ "min" ], parts[ partNumber - 1 ][ "max" ], parts[ partNumber - 1 ][ "lang" ] );
            text.calc();
        }
        catch ( err ) {
            console.log();
        }
    }
    function checkSecondPart () {
        try {
            return text.check();
        }
        catch ( err ) {
            console.log();

            false;
        }
    }
    function resultSecondPart () {
        try {
            return text.results();
        }
        catch ( err ) {
            console.log();

            false;
        }
    }


    function endTest () {
        try {
            alert( "Время на выполнение заданий вышло." );
            timer.stop();

            let res = "";

            if ( partNumber === 1 ) {
                res = resultFirstPart();
            }
            if ( partNumber === 2 ) {
                res = resultSecondPart();
                res = res.replaceAll('%','процентов');
            }


            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/russian',
                type: 'POST',
                dataType: 'html',
                data: "r=" + res + "&p=" + partNumber + "&i=e",
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
                            $( "#part, #bottomBtn" ).remove();
                            alert( "Итоги олимпиады будут опубликованы позже" );
                            window.open( "/languages/start", "_parent" );

                            return;
                        }

                        if ( data[ "status" ] === "error" ) {
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
            console.log();
        }
    }

    function end () {
        try {
            if ( !checkSecondPart() || !confirm( "Завершить олимпиаду?" ) ) {
                return;
            }

            let res = resultSecondPart();
            res = res.replaceAll('%','процентов');

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/russian',
                type: 'POST',
                dataType: 'html',
                data: "r=" + res + "&p=" + partNumber,
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
                            $( "#part, #bottomBtn" ).remove();
                            timer.stop();
                            alert( "Итоги олимпиады будут опубликованы позже" );
                            window.open( "/languages/start", "_parent" );

                            return;
                        }

                        if ( data[ "status" ] === "error" ) {
                            alert( data[ "errorText" ] );
                            isSend = false;

                            return;
                        }

                        if ( data[ "status" ] === "no" ) {
                            $( "#part, #bottomBtn" ).remove();
                            timer.stop();
                            alert( "Ранее вы уже выполнили задания по данному языку.\nИтоги олимпиады будут опубликованы позже" );
                            window.open( "/languages/start", "_parent" );

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
            console.log();
        }
    }

    return {
        init: function () {
            init ();
        }
    }
};

$( startRussian );