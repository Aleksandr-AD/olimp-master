function startEnglish () {
  english.init();
}

let english = new function () {
    let partNumber = 1;
    let maxPartNumber = 3;
    let parts = [
        {
            "head" : "Прочитайте текст, вставьте в тексте в пропуски следующие слова и словосочетания:",
            "words" : [
                "erleichtere", "beispielsweise", "Städte ", "Wünsche ", "haben", "die Stadtgesellschaft", "gestalten", "innerhalb", "eingebunden werden", "smarter", "wie", "sich", "stärker", "exklusiv", "danach", "die Bürgerinnen und Bürger", "anstatt", "die", "gemeinsam", "übrigens"
            ],
            "text" : "<p class=\"iTParagraph\">„Smart“ wollen heutzutage fast alle sein – auch [in] (1). Dabei geht es auch nicht um die Einführung von Technik um ihrer selbst willen. Sondern um [in] (2) – sie stehen im Fokus. Deswegen ist Lebensqualität das zentrale Thema des Smart City-Ansatzes. Also Fragen wie „Wie [in] (3) ich meinen Einwohnern den Alltag?“. Und das [in] (4) einer Bandbreite von der Anmeldung zum Kindergartenplatz, der Organisation der Müllabfuhr bis zur Bezahlung der Hundesteuer oder der Genehmigung eines Bauantrags.</p>" +
                "<p class=\"iTParagraph\">Nahezu alle öffentlichen Verwaltungen [in]  (5) längst erkannt, dass Top-Down-Initiativen keine Erfolgsgarantie bieten. Um die Herausforderungen der zunehmenden Urbanisierung zu stemmen, muss [in] (6) beteiligt werden. Die Bedürfnisse der Bürger müssen [in] (7) in den Mittelpunkt rücken. Bei relevanten Entscheidungen sollten [in] (8) der Bürger und lokalen Unternehmen einfließen. Dafür müssen sie in Prozesse [in] (9). Und zwar so früh wie möglich. Nur dann wird eine Stadt oder Kommune auch wirklich [in] (10).</p>" +
                "<p class=\"iTParagraph\">Diese Herangehensweise zahlt sich aus: Smart Cities [in] (11) Kopenhagen oder Wien gehören zu den lebenswertesten Städten der Welt. In beiden Städten haben die Verantwortlichen nach Lösungen gesucht, [in] (12) die Lebensqualität der Menschen verbessern: Kopenhagen hat dafür die Strategie „Let’s co-create Copenhagen” („Lasst uns Kopenhagen gemeinsam [in] (13)“) ausgerufen. Die Stadt hat [in] (14) mit den Bürgern Smart City Ziele erarbeitet. Diese richten sich [in] (15), wo die Einwohner den größten Nutzen für Kopenhagen sehen. Die Stadt ermuntert ihre Bürger [in] (16) sich grundsätzlich mehr an der frischen Luft aufzuhalten. Oder mit dem Fahrrad [in] (17) mit dem Auto zu fahren. Die Ergebnisse schlagen [in] (18) in der Infrastruktur nieder. So gibt es zum Beispiel viele neue Brücken, die [in] (19) für Fahrradfahrer und Fußgänger errichtet wurden. „Smart“ zu sein, ist [in] (20) kein Privileg von Großstädten oder Metropolen. Auch kleinere Städte, Kommunen und Regionen können „smart“ werden.</p>"
        },
        {
            "src": "/resources/videos/languages/german.mp4",
            "head": "Höhren Sie den Text und lösen Sie eine Richtig-Falsch-Aufgabe. Запись будет доступна для прослушивания не более 2-х раз. Остановить, поставить на паузу, перемотать невозможно.",
            "quests": [
                {
                    "quest": "Facebook hat für seine Plattformen keine neue Shopping-Software freigeschaltet.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Der Shop auf Facebook wurde von Mark Zuckerberg wegen Coronakrise eingeführt.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Kleinunternehmen in der BRD können so direkt ihre Produkte in den sozialen Netzwerken verkaufen, ohne dass Kunden auf E-Commerce-Seiten wechseln müssen.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Die Einrichtung des Facebookshops ist kostenfrei und auch Progammiererkentnisse nicht erforderlich.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Instagram hat geholfen, Geschäftsideen zu kommunizieren.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Der Techriese versucht Daten über das Kaufverhalten seiner Nutzer zu verschaffen.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Wer einmal seine Kreditkarte hinterlegt hat, kann auf allen Apps der Facebookgruppen shoppen.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Der Facebookgeschäftsmodel basiert auf Daten.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Es geht am Ende um das Vergnügen, auf dem Markt zu dominieren.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
                {
                    "quest": "Im Moment bieten Kleinunternehmen eine Alternative zu Amazon.",
                    "answers": [
                        "Верно",
                        "Неверно"
                    ]
                },
            ]
        },
        {
            "textHead" : 'Übersetzen Sie den Text:<br/>' +
            'Drei Fahrspuren verengen sich zu einer, Stoßstange an Stoßstange geht es im Schritttempo vorwärts – für viele Pendler ein täglicher Albtraum. Auf ihrem Weg zum Arbeitsplatz quälen sie sich immer mehr Menschen Tag für Tag in ihren Autos durch unzählige Baustellen. Das kostet Zeit und vor allem Nerven.<br/>' +
            'Schuld an den Baumaßnahmen sind nicht selten marode Brücken. Viele Schäden bleiben zu lange unentdeckt, Reparaturen starten zu spät. Die aufwendigen Sanierungen dauern dann oft Jahre – und nur den Verkehrskollaps rund um die Nadelöhre gibt’s gratis. Genau hier setzt das intelligente Monitoring von Betoninfrastrukturen an.<br/>' +
            'Die „intelligente Brücke“ ist ein digitales Frühwarnsystem. Genutzt wird es z. B. am Flughafen Düsseldorf, wo 50 Sensoren in der Fahrbahn und den Brückenkappen frühzeitig Materialermüdung anzeigen. Hier geht es darum, Schäden effizient vorzubeugen. Die drahtlosen Sensoren in Brückenbauten messen maßgebliche Werte wie Temperatur, Feuchte und Korrosion. Alle ermittelten Daten werden über unser NB-IoT Netzwerk an ein Backend übertragen, wo sie im Detail ausgewertet werden. Die Straßeninfrastruktur wird nachhaltig verbessert. Der Verkehr bleibt dauerhaft im Fluss – und das freut nicht nur die Pendler.',
            "min" : 10,
            "max" : 600,
            "lang" : "rus"
        }
    ];
    let isSend = false;

    function init () {
        try {
            $( "#testHeader > span" ).html( "Олимпиада по немецкому языку 2020" );
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
            if ( isSend ) {
                return;
            }

            isSend = true;

            if ( partNumber === 1 && !checkFirstPart () || partNumber === 2 && !checkSecondPart() ) {
                isSend = false;
                return;
            }

            if ( !confirm( "Вернуться и поменять ответы будет невозможно, продолжить?" ) ) {
                isSend = false;
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
                url: 'https://olimp.sgugit.ru/languages/german',
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

            isSend = false;
        }
    }

    function buildFirstPart () {
        try {
            $( "#pFirst" ).remove();
            $( "#partHeader > span" ).html( "ЧАСТЬ I" );
            $( "#part" ).append( '<div id="pFirst"><div id="insertHead">\n' +
                '                    ' + parts[ partNumber - 1 ][ "head" ] +
                '                </div>\n' +
                '\n' +
                '                <div id="insertWords">\n' +
                '                </div>\n' +
                '\n' +
                '                <div id="insertText">\n' +
                '                    <div id="iTPop">\n' +
                '                    </div>\n' +
                '                </div></div>' );

            insert.init( $( "#pFirst" ), parts[partNumber - 1][ "words" ], parts[partNumber - 1][ "text" ] );
            lineStatus.init ( parts[ partNumber - 1 ][ "words" ].length );
        }
        catch ( err ) {
            console.log();
        }
    }
    function checkFirstPart () {
        try {
            return insert.check();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }
    function resultFirstPart () {
        try {
            return insert.results();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }

    function buildSecondPart () {
        try {
            $( "#pFirst" ).remove();
            $( "#partHeader > span" ).html( "ЧАСТЬ II" );
            $( "#part" ).append( '<div id="pSecond"><div id="videoHead">\n' + parts[ partNumber - 1 ][ "head" ] +
                '                </div>\n' +
                '\n' +
                '                <div id="videoVideo">\n' +
                '                    <video preload="auto">\n' +
                '                        <source src="' + parts[ partNumber - 1 ][ "src" ] + '">\n' +
                '                    </video>\n' +
                '                    <div id="vVButton" class="vVButtonPlay" title="Воспроизвести"></div>' +
                '                </div>\n' +
                '\n' +
                '                <div id="videoTest">' +
                '                </div></div>' );

            video.init( $( "#videoVideo" ) );
            testing.init( $( "#videoTest" ), parts[ partNumber - 1 ][ "quests" ] );
            lineStatus.init ( parts[ partNumber - 1 ][ "quests" ].length );
        }
        catch ( err ) {
            console.log();
        }
    }
    function checkSecondPart () {
        try {
            return testing.check();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }
    function resultSecondPart () {
        try {
            return testing.results();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }

    function buildThreePart () {
        try {
            $( "#pSecond" ).remove();
            $( "#partHeader > span" ).html( "ЧАСТЬ III" );
            $( "#part" ).append( '<div id="pThree">\n' +
                '                <div id="textHead" class="unselectable">\n' +
                parts[ partNumber - 1 ][ "textHead" ] +
                '                </div>\n' +
                '\n' +
                '                <div id="textWords">\n' +
                '                    <div id="tWNeed">\n' +
                '                        Объём работы - от<span id="tWNFrom">' + parts[ partNumber - 1 ][ "min" ] + '</span>до<span id="tWNTo">' + parts[ partNumber - 1 ][ "max" ] + '</span>слов.\n' +
                '                    </div>\n' +
                '\n' +
                '                    <div id="tWCurrent">\n' +
                '                        Количество слов:<span>0</span>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '\n' +
                '                <textarea id="textText"></textarea>\n' +
                '            </div>' );

            text.init( $( "#textText"), $( "#tWCurrent > span" ), parts[ partNumber - 1 ][ "min" ], parts[ partNumber - 1 ][ "max" ], parts[ partNumber - 1 ][ "lang" ] );
            lineStatus.init ( 0 );
        }
        catch ( err ) {
            console.log();
        }
    }
    function checkThreePart () {
        try {
            return text.check();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }
    function resultThreePart () {
        try {
            return text.results();
        }
        catch ( err ) {
            console.log();

            return false;
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
            }
            if ( partNumber === 3 ) {
                res = resultThreePart();
            }

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/german',
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
            console.log( "Клик на завершение" );
            if ( isSend ) {
                return;
            }

            isSend = true;

            if ( !checkThreePart() || !confirm( "Завершить олимпиаду?" ) ) {
                isSend = false;
                return;
            }

            let res = resultThreePart();
            res = res.replaceAll('%','процентов');

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/german',
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
            isSend = false;
        }
    }

    return {
        init: function () {
            init ();
        }
    }
};

$( startEnglish );