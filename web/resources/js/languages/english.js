function startEnglish () {
  english.init();
}

let english = new function () {
    let partNumber = 1;
    let maxPartNumber = 3;
    let parts = [
        {
            "src": "/resources/videos/languages/english.mp4",
            "head": "Watch the video and choose the answers (true or false). Запись будет доступна для просмотра не более 2-х раз. Остановить, поставить на паузу, перемотать невозможно.",
            "quests": [
                {
                    "quest": "According to the speaker the population in Copenhagen causes two-thirds of the city’s carbon emission.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "Today more than 60 % of the citizens use bikes every day.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "The speaker says that ten years ago they spent $300 million to improve biking infrastructure. ",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "The Mayor told that he had come to Copenhagen in the early 80-es.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "They use the cold water to cool down the electricity production equipment. ",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "At the Street Lab they test their inventions and air-sensors in particular.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "Air-sensors turned out to be so effective that they are selling them to other countries",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "The speaker says that the Copenhageners willingly help the city’s authorities in their initiatives.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "The speaker says that he is definitely sure that they will have become a carbon neutral city by 2025.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
                {
                    "quest": "The speaker says that good economy does not have anything to do with green transformation of the city.",
                    "answers": [
                        "True",
                        "False",
                        "Not Mentioned"
                    ]
                },
            ]
        },
        [
            {
                "quest" : "Algae in sea water are able to react to stimuli from humans.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "Algae streetlights would use electricity to stimulate marine organisms.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "Algae streetlights would be more expensive to build than conventional streetlights.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "«Algae streetlights could cause environmental damage.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "«The Nuenen cycle path only operates in certain weather conditions.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "The Nuenen cycle path is named because of its association with a famous painting.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "Koo Jeong-A is finding it increasingly difficult to source her light-emitting material.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "Pollution caused by lighting is more severe than many people realize.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "«Authorities in Glasgow are trying to light the city using only renewable energy sources.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            },
            {
                "quest" : "«Roosengaarde believes that computers are the solution to urban lighting problems.<br/>",
                "answers" : [
                    "True",
                    "False",
                    "Not Mentioned"
                ]
            }
        ],
        {
            "textHead" : 'Переведите текст с английского на русский.<br/><br/>' +
            'Smart cities aren’t just a concept or a dream of the future.<br/>' +
                'Thanks to the wildly innovative Internet of Things (IoT) solutions, many are already active and expanding rapidly.<br/>' +
                'Municipal governments are leveraging cellular and Low Power Wide Area (LPWAN) wireless technologies to connect and improve infrastructure, efficiency, convenience, and quality of life for residents and visitors alike.<br/><br/>' +
                'What is a smart city?<br/>' +
            'A smart city is a framework, predominantly composed of Information and Communication Technologies (ICT), to develop, deploy, and promote sustainable development practices to address growing urbanization challenges. A big part of this ICT framework is essentially an intelligent network of connected objects and machines that transmit data using wireless technology and the cloud.  Cloud-based IoT applications receive, analyze, and manage data in real-time to help municipalities, enterprises, and citizens make better decisions that improve quality of life. Citizens engage with smart city ecosystems in various ways using smart phones and mobile devices and connected cars and homes. Communities can improve energy distribution, streamline trash collection, decrease traffic congestion, and even improve air quality with help from the IoT.<br/><br/>' +
            'Why do we need smart cities?<br/>' +
            'Urbanization is a non-ending phenomenon. Today, 54% of people worldwide live in cities, a proportion that’s expected to reach 66% by 2050. Combined with the overall population growth, urbanization will add another 2.5 billion people to cities over the next three decades. Thus, environmental, social, and economic sustainability is a must to keep pace with this rapid expansion that is taxing our cities’ resources.<br/>',
            "min" : 10,
            "max" : 600,
            "lang" : "rus"
        }
    ];
    let isSend = false;

    function init () {
        try {
            $( "#testHeader > span" ).html( "Олимпиада по английскому языку 2020" );
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
                url: 'https://olimp.sgugit.ru/languages/english',
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
            $( "#part" ).append( '<div id="pFirst"><div id="videoHead">\n' + parts[ partNumber - 1 ][ "head" ] +
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
    function checkFirstPart () {
        try {
            return testing.check();
        }
        catch ( err ) {
            console.log();

            return false;
        }
    }
    function resultFirstPart () {
        try {
            return testing.results();
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
            $( "#part" ).append( '<div id="pSecond">' +
                '<div class="TTH">Using living organisms to light the cities of the future<div/>' +
                '<div class="bigText"> <br/>' +
                'City lighting may seem like a mundane topic, but a number of innovations regarding how we light our urban centres are taking a highly unconventional approach.<br/>' +
                'A good example would be the idea of using algae for street lighting. Algae, of course, are the type of flora most commonly associated with the marine environment. Certain types of algae emit light or phosphorescence. You may have noticed sometimes at the beach after dark, when you move your hand through the water, it appears to light up with a beautiful luminescent glow. Further movement only encourages a greater response until the whole area of the sea around you seems to be burning with a cool fire. Well there is now a very real prospect of using such algae in lamppost as a way of illuminating our streets. But this would be lighting without copper wires, cables or current of any sort. And while the technology itself is still at the developmental stage, algae street lights would depend solely on living organisms providing an emission free inexhaustible supply of light to city streets. That’s not to say, however, that there are no issues with algae streetlights. Taking an organism from its original ecosystem and introducing it into an alien habitat can have unforeseen consequences in terms of harm to the new ecosystem and the species that depend on it. Thus the use of algae in urban lighting has enormous potential, but there are certain risks involved with any attempted manipulation of the natural world.<br/><br/>' +
                'A related innovation is already operating in the Dutch town of Nuenen. Here a previously unlit cycle path has been resurfaced with a material that consists of thousands of twinkling stones in order to create an illuminated route by capturing and radiating ambient light. The Van Gogh Path, so called after the artist who lived in the town in 1883, blends the traditional with contemporary in a gesture that acknowledges Van Gogh’s masterpiece The Starry Night, but also shows the way ahead for city lighting. South Korean artists Koo Jeong-A experimenting with unusual light sources, though in her case it is glow-in-the-dark concrete.<br/><br/>' +
                'She constructed her first installation from the unusual materials in France several years ago and has now been commissioned to build a glow-in-the-dark skate park in the British city of Liverpool. This will obviously require vast quantities of the specially formulated concrete, but she says it’s becoming increasingly easy to lay your hands on the exotic substances as the technology is becoming better understood. So far her use of the concrete has largely been for aesthetic purposes, but it is not difficult to foresee a time when the technology could provide solar-powered lighting in more practical urban scenarios.<br/><br/>' +
                'Why should we care about any of this? What’s wrong with conventional electrical city lighting anyway? Well, the problem of light pollution is two-fold. First, of course, electrical lighting in most cities comes from non-renewable resources. According to the International Energy Agency, lighting accounts for almost 20% of global electricity consumption – and thus responsible for high levels of carbon emissions. But there’s also the belief that that electrical light itself constitutes a form of pollution by destroying our view of the night sky and, possibly, making us sick as well. For both these reasons, then, it seems prudent to investigate alternative approaches.<br/><br/>' +
                'The city of Glasgow is attempting to use integrated computer technology and intelligent street lighting to monitor how citizens interact with the urban landscape and minimize electrical consumption and thus emissions. This ‘Smart City’ approach is seen by many as the way of the future, but Dutch designer Daan Roosegaarde isn’t convinced. It is Roosegaarde who is pioneering the altogether more radical approach of using living organisms and materials from the natural world in order to bypass electrical light entirely – what he calls bioluminescence. He believes that this new definition of ‘technology’ can one day completely replace microchips and digital systems as we find better ways of harnessing the light-generating mechanisms that already exist in the natural world.<br/><div/>' +
                '<br/><div/>' );

            testing.init( $( "#pSecond" ), parts[partNumber - 1] );
            lineStatus.init ( parts[ partNumber - 1 ].length );
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

    function endTest ( isShowAlert ) {
        try {
            if ( isShowAlert === true ) {
                alert("Время на выполнение заданий вышло.");
            }
            timer.stop();

            let res = "";

            if ( partNumber === 1 ) {
                res = resultFirstPart();
            }
            if ( partNumber === 2 ) {
                res = resultSecondPart();
            }
            if ( partNumber === 3 ) {
                res = resultThreePart().replace;
                res = res.replaceAll('%','процентов');
            }

            $.ajax({
                url: 'https://olimp.sgugit.ru/languages/english',
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
                url: 'https://olimp.sgugit.ru/languages/english',
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