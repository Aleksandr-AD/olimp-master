let testing = new function () {
    let parent = null;
    let needAnswerCount = 0;

    function init ( parentElem, questions ) {
        try {
            if ( parentElem === undefined || parentElem === null || questions === undefined || questions === null ) {
                return;
            }

            parent = parentElem;
            needAnswerCount = questions.length;
            $( ".tItem", parentElem ).remove();

            for ( let i = 0; i <= questions.length - 1; i++ ) {
                let item = '<div class="tItem" data-val="' + i + '">\n' +
                    '                    <div class="tINumber">Вопрос ' + ( i + 1 ) + ' из ' + questions.length + '</div>\n' +
                    '\n' +
                    '                    <div class="tIQuest">' + questions[i]["quest"] + '</div>\n' +
                    '\n' +
                    '                    <div class="tIAnswers">\n';

                for ( let x = 0; x <= questions[i]["answers"].length - 1; x++ ) {
                    item += '                    <div class="tIAItem">\n' +
                        '                            <div></div> <span>' + questions[i]["answers"][x] + '</span>\n' +
                        '                        </div>\n';
                }

                item += '                    </div>\n' +
                    '                </div>';

                $( parentElem ).append( item );
            }

            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents () {
        try {
            $( ".tIAItem" ).on( "click", clickTestAnswer );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function clickTestAnswer ( e ) {
        try {
            if ( $( ".tIAISelect", e.currentTarget ).length >= 1 ) {
                $( ".tIAISelect", e.currentTarget ).removeClass( "tIAISelect" );

                return;
            }

            let parentAnswers = $( e.currentTarget ).parent( ".tIAnswers" );

            $( "* > .tIAISelect", parentAnswers ).removeClass( "tIAISelect" );
            $( "div", e.currentTarget ).addClass( "tIAISelect" );
        }
        catch ( err ) {
            console.log( err );
        }
        finally {
            lineStatus.update ();
        }
    }

    function check () {
        try {
            let answerCount = 0;

            $( ".tItem", parent ).each( function ( index, item ) {
                let count = $( "* > .tIAISelect", item ).length;

                if ( count > 1 ) {
                    alert( "На один из вопросов дано больше 2-ух ответов" );

                    return false;
                }

                if ( count === 1 ) {
                    answerCount++;
                }
            } );

            if ( answerCount !== needAnswerCount ) {
                alert( "Перед продолжением необходимо ответить на все вопросы" );

                return false;
            }

            return true;
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    function results () {
        try {
            let result = "";

            $( ".tItem", parent ).each(function ( index, item ) {
                let selectValue = $( "* > .tIAISelect", item );

                if ( selectValue.length === 1 ) {
                    let parentItem = $( selectValue ).parent( ".tIAItem" );

                    result += "," + ( $( parentItem ).index() + 1 );
                }
                else {
                    result += ",0"
                }
            });

            return result.substring( 1 );
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    return  {
        init: function ( parentElem, questions ) {
            init ( parentElem, questions );
        },
        check: function () {
            return check ();
        },
        results : function () {
            return results();
        }
    }
};

let lineStatus = new function () {
    let isShow = false;

    function init ( questCount ) {
        try {
            if (questCount === undefined || questCount === null) {
                return;
            }

            if ( questCount === 0 ) {
                hide ();

                return;
            }

            let maxHeight = screen.availHeight - 650;
            let itemSize = maxHeight / questCount;
            let line = $( "#lineStatuses" );

            if ( itemSize > 20 ) {
                itemSize = 20;
            }

            $( "div", line ).remove();

            for ( let i = 1; i <= questCount; i++ ) {
                $( line ).append( '<div style="width: ' + itemSize + 'px;height: ' + itemSize + 'px;" data-val="' + (i - 1) + '"></div>' );
            }

            show();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function update () {
        try {
            if ( isShow === false ) {
                return;
            }

            $( ".tItem" ).each( function ( index, item ) {
                if ( $( "* > .tIAISelect", item ).length >= 1 ) {
                    $( "#lineStatuses > div[data-val=\"" + $( item ).attr( "data-val" ) + "\"]" ).addClass( "lSSet" );
                }
                else {
                    $( "#lineStatuses > div[data-val=\"" + $( item ).attr( "data-val" ) + "\"]" ).removeClass( "lSSet" );
                }
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function updateAllAnswer () {
        try {
            if ( isShow === false ) {
                return;
            }

            $( ".allAnswerItem" ).each( function ( ind, item ) {
                let index =  $( item ).attr( "data-val" );

                console.log("обновляем " + index + " " + allAnswer.checkAnswer( index ));

                if ( allAnswer.checkAnswer( index ) ) {
                    $( "#lineStatuses > div[data-val=\"" + index + "\"]" ).addClass( "lSSet" );
                }
                else {
                    $( "#lineStatuses > div[data-val=\"" + index + "\"]" ).removeClass( "lSSet" );
                }
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function updateInsert () {
        try {
            if ( isShow === false ) {
                return;
            }

            $( "#insertWords > .iWItem" ).each( function ( ind, item ) {
                let index =  $( item ).attr( "data-val" );

                console.log("обновляем " + index + " " + insert.checkElem( index ));

                if ( insert.checkElem( index ) ) {
                    $( "#lineStatuses > div[data-val=\"" + index + "\"]" ).addClass( "lSSet" );
                }
                else {
                    $( "#lineStatuses > div[data-val=\"" + index + "\"]" ).removeClass( "lSSet" );
                }
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function show () {
        try {
            if ( isShow === true ) {
                return;
            }

            console.log("hide");
            isShow = true;
            $( "#lineStatuses" ).addClass( "lineStatusesShow" );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function hide () {
        try {
            if ( !isShow ) {
                return;
            }

            console.log("hide");
            isShow = false;
            $( "#lineStatuses" ).removeClass( "lineStatusesShow" );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    return {
        init : function ( questCount ) {
            init ( questCount );
        },
        update : function () {
            update ();
        },
        updateAllAnswer: function () {
            updateAllAnswer ();
        },
        updateInsert: function () {
            updateInsert ();
        }
    }
};

let timer = new function () {
    let currentTimeMinute = null;
    let currentTimeSeconds = null;
    let timeTimer = null;
    let timeInterval = 1000;
    let fiveMinute = false;

    function init ( startTimeMinutes, startTimeSeconds ) {
        try {
            if (startTimeMinutes === undefined || startTimeMinutes === null) {
                startTimeMinutes = 0;
            }
            if (startTimeSeconds === undefined || startTimeSeconds === null) {
                startTimeSeconds = 0;
            }

            if ( startTimeMinutes === 0 && startTimeSeconds === 0 ) {
                return;
            }

            currentTimeMinute = formatNumber(startTimeMinutes);
            currentTimeSeconds = formatNumber(startTimeSeconds);

            update ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function update () {
        try {
            if ( currentTimeMinute === null || currentTimeSeconds === null ) {
                return;
            }

            let timeMinStr = currentTimeMinute.toString();
            let timeSecStr = currentTimeSeconds.toString();

            for ( let i = 1; i <= 4; i++ ) {
                if ( i <= 2 ) {
                    $( ".tM" + i + " > span" ).html( timeMinStr.substring(i - 1, i) );
                }
                else {
                    $( ".tS" + (i - 2) + " > span" ).html( timeSecStr.substring(i - 3, i - 2) );
                }
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function formatNumber ( number ) {
        try {
            while ( number.toString().length !== 2 ) {
                //if ( parseInt( number ) < 10 ) {
                    number = "0" + number;
                /*}
                else {
                    number += "0";
                }*/
            }

            return number;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function start ( ) {
        try {
            if ( currentTimeMinute === null || currentTimeSeconds === null ) {
                return;
            }

            timeTimer = setTimeout( continueTimer, timeInterval );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function continueTimer ( ) {
        try {
            if ( timeTimer !== null ) {
                clearTimeout( timeTimer );
                timeTimer = null;
            }

            currentTimeSeconds -= timeInterval / 1000;

            if ( currentTimeSeconds <= 0 ) {
                currentTimeSeconds = 60;
                currentTimeMinute -= 1;
            }

            if ( parseInt(currentTimeMinute) < 0 ) {
                currentTimeMinute = formatNumber( 0 );
                currentTimeSeconds = formatNumber( 0 );
                update();

                $( window ).trigger( "endTest" );

                return;
            }
            if (parseInt(currentTimeMinute) <= 4 && fiveMinute === false){
                alert("Внимание!\nДо конца олимпиады осталось 5 минут.");

                fiveMinute = true;
            }

            currentTimeMinute = formatNumber( currentTimeMinute );
            currentTimeSeconds = formatNumber( currentTimeSeconds );
            update();

            timeTimer = setTimeout( continueTimer, timeInterval );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function stop ( ) {
        try {
            if ( timeTimer !== null ) {
                clearTimeout( timeTimer );
                timeTimer = null;
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    return {
        init : function ( startTimeMinutes, startTimeSeconds ) {
            init ( startTimeMinutes, startTimeSeconds );
        },
        start : function () {
            start ();
        },
        stop : function () {
            stop ();
        }
    }
};

let text = new function () {
    let textarea = null;
    let wordCount = null;
    let min = 0, max = 0;
    let lang = null;
    let langNoCalc = {
        "eng" : ["a", "an", "the", "and"]
    };

    function init ( textElem, wordCountElem, minCount, maxCount, langCalc ) {
        try {
            if (textElem === undefined || textElem === null || wordCountElem === undefined || wordCountElem === null || minCount === undefined || minCount === null || maxCount === undefined || maxCount === null) {
                return;
            }
            if ( langCalc === undefined || langCalc === null ) {
                langCalc = false;
            }

            if ( maxCount <= 0 || maxCount <= minCount ) {
                return;
            }

            textarea = textElem;
            wordCount = wordCountElem;
            min = minCount;
            max = maxCount;
            lang = langCalc;

            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents ( ) {
        try {
            $( textarea ).on( "input", calc );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function calc ( e ) {
        try {
            let str = $( textarea ).val().split( " " );
            let count = 0;

            for ( let i = 0; str.length === 1 && str[0] !== "" && i <= str.length - 1 || str.length > 1 && i <= str.length - 1; i++ ) {
                if ( lang !== false && isNoCalcLangElem( str[ i ] ) === false  ) {
                    count++;
                }
                else if ( lang === false ) {
                    count++;
                }
            }

            $( wordCount ).html( count );

            return count;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function check ( e ) {
        try {
            if ( calc ( null ) < min || calc ( null ) > max ) {
                alert( "Текст должен содержать от " + min + " до " + max + " слов.\nОтредактируйте текст и попробуйте снова." );

                return false;
            }

            return true;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function results ( e ) {
        try {
            return $( textarea ).val();
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    function isNoCalcLangElem ( elem ) {
        try {
            if ( !langNoCalc.hasOwnProperty( lang ) ) {
                return false;
            }

            for ( let i = 0; i <= langNoCalc[ lang ].length - 1; i++ ) {
                if ( elem === langNoCalc[ lang ][i] ) {
                    return true;
                }
            }

            return false;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    return {
        init : function ( textElem, wordCountElem, minCount, maxCount, langCalc ) {
            init ( textElem, wordCountElem, minCount, maxCount, langCalc );
        },
        check : function () {
            return check ();
        },
        calc: function () {
            calc( null );
        },
        results: function () {
            return results();
        }
    }
};

let allAnswer = new function () {
    let parent = null;

    function init ( parentElem, questions ) {
        try {
            if (parentElem === undefined || parentElem === null || questions === undefined || questions === null ) {
                return;
            }

            parent = parentElem;

            build ( questions );
            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function build ( questions ) {
        try {
            for ( let i = 0; i <= questions.length - 1; i++ ) {
                $( parent ).append( '<div class="allAnswerItem" data-val="' + i + '">\n' +
                    '                    <div class="aAIQuest">\n' +
                    '                        ' + questions[ i ][ "quest" ] +
                    '                    </div>\n' +
                    '\n' +
                    '                    <textarea class="aAIA"></textarea>\n' +
                    '                </div>' );
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents ( ) {
        try {
            $( ".aAIA" ).on( "input", function ( e ) {
                lineStatus.updateAllAnswer();
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function check ( index, isShowError, isCheckAll ) {
        try {
            if ( isCheckAll === null || isCheckAll === undefined ) {
                isCheckAll = true;
            }
            if ( isShowError === null || isShowError === undefined ) {
                isShowError = true;
            }
            if ( !isCheckAll && (index === null || index === undefined) ) {
                if ( isShowError ) {
                    alert( "Не передан индекс" );
                }

                return false;
            }

            let result = false;
            let count = 0, goodCount = 0;

            $( ".allAnswerItem" ).each ( function ( ind, elem ) {
                if ( isCheckAll ) {
                    count++;

                    if ( $( ".aAIA", elem ).val().length >= 10 ) {
                        goodCount++;
                    }
                }
                else {
                    if ( $( elem ).attr( "data-val" ) === index ) {

                        console.log( $( ".aAIA", elem ).val() + " " + $( ".aAIA", elem ).val().length );
                        if ( $( ".aAIA", elem ).val().length < 10 ) {
                            if ( isShowError ) {
                                alert( "Ответ должен содержать больше 10 символов" );
                            }

                            //return false;
                        }
                        else {
                            console.log( "успех" );
                            result = true;
                        }

                    }
                }
            } );

            if ( isCheckAll ) {
                if ( count === 0 || goodCount !== count ) {
                    if ( isShowError ) {
                        alert("Ответ должен содержать больше 10 символов");
                    }

                    return false
                }

                return true;
            }
            else {
                return result;
            }
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function results (  ) {
        try {
            let result = "";

            $( ".allAnswerItem > .aAIA" ).each ( function ( ind, elem ) {
                result += "|||" + $( elem ).val();
            } );

            return result.substring( 3 );
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    return {
        init : function ( parentElem, questions ) {
            init ( parentElem, questions );
        },
        check : function ( ) {
            return check ( null, true, true );
        },
        checkAnswer : function ( index ) {
            return check ( index, false, false );
        },
        calc: function () {
            calc( null );
        },
        results: function () {
            return results();
        }
    }
};

let audio = new function () {
    let parent = null;
    let isPlay = false;
    let playCount = 0;

    function init ( parentElem ) {
        try {
            if (parentElem === undefined || parentElem === null ) {
                return;
            }

            parent = parentElem;

            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents ( ) {
        try {
            $( "#aSButton", parent ).on( "click", play );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function play ( e ) {
        try {
            if ( isPlay ) {
                return;
            }

            isPlay = true;

            $( e.currentTarget ).addClass( "aSButtonInactive" );
            $( "audio", parent ).on( "ended", end );
            $( "audio", parent )[0].play();
        }
        catch ( err ) {
            console.log( err );

            isPlay = false;
        }
    }

    function end ( e ) {
        try {
            if ( !isPlay ) {
                return;
            }

            playCount++;

            if ( playCount === 2 ) {
                $( "*", parent ).remove();

                return;
            }

            $( "audio", parent ).off( "ended", end );
            $( "audio", parent )[0].currentTime = 0;
            $( "#aSButton", parent ).removeClass( "aSButtonInactive" );
            isPlay = false;
        }
        catch ( err ) {
            console.log( err );

            isPlay = false;
        }
    }

    function check ( index, isShowError, isCheckAll ) {
        try {
            if ( isCheckAll === null || isCheckAll === undefined ) {
                isCheckAll = true;
            }
            if ( isShowError === null || isShowError === undefined ) {
                isShowError = true;
            }
            if ( !isCheckAll && (index === null || index === undefined) ) {
                if ( isShowError ) {
                    alert( "Не передан индекс" );
                }

                return false;
            }

            let result = false;
            let count = 0, goodCount = 0;

            $( ".allAnswerItem" ).each ( function ( ind, elem ) {
                if ( isCheckAll ) {
                    count++;

                    if ( $( ".aAIA", elem ).val().length >= 10 ) {
                        goodCount++;
                    }
                }
                else {
                    if ( $( elem ).attr( "data-val" ) === index ) {

                        console.log( $( ".aAIA", elem ).val() + " " + $( ".aAIA", elem ).val().length );
                        if ( $( ".aAIA", elem ).val().length < 10 ) {
                            if ( isShowError ) {
                                alert( "Ответ должен содержать больше 10 символов" );
                            }

                            //return false;
                        }
                        else {
                            console.log( "успех" );
                            result = true;
                        }

                    }
                }
            } );

            if ( isCheckAll ) {
                if ( count === 0 || goodCount !== count ) {
                    if ( isShowError ) {
                        alert("Ответ должен содержать больше 10 символов");
                    }

                    return false
                }

                return true;
            }
            else {
                return result;
            }
        }
        catch ( err ) {
            console.log( err );
            if ( isShowError ) {
                alert( "Ошибка: " + err );
            }

            return false;
        }
    }

    return {
        init : function ( parentElem ) {
            init ( parentElem );
        },
        check : function ( ) {
            return check ( null, true, true );
        },
        checkAnswer : function ( index ) {
            return check ( index, false, false );
        },
        calc: function () {
            calc( null );
        }
    }
};

let insert = new function () {
    /*
    * В тексте [in] заменяются на элементы для вставки
    * */

    let parent = null;
    let words = null;
    let isShowPop = false;
    let clickInsertItemIndex = -1;

    function init ( parentElem, wordsArray, textData ) {
        try {
            if (parentElem === undefined || parentElem === null || wordsArray === undefined || wordsArray === null || textData === undefined || textData === null) {
                return;
            }

            parent = parentElem;
            words = [];

            $( wordsArray ).each( function ( index, elem ) {
                words.push({
                    "word" : elem,
                    "isFree" : true
                });
            } );

            build ( textData );
            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents ( ) {
        try {
            $( "* > .iTItem", parent ).on( "click", showPop );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function showPop ( e ) {
        try {
            if ( isShowPop ) {return;}

            isShowPop = true;

            addPopEvents();

            clickInsertItemIndex = $( e.currentTarget ).attr( "data-val" );

            let pop = $( "#iTPop" );
            let popSize = [ $( pop ).outerWidth( false ), $( pop ).outerHeight() ];
            let bodySize = [ $( "body" ).width(), $( "body" ).height() ];
            let clickInsertOffsets = [ $( e.currentTarget ).offset().left, $( e.currentTarget ).offset().top ];
            let insertSize = [ $( e.currentTarget ).outerWidth(), $( e.currentTarget ).outerHeight() ];
            let textParent = [ $( "#insertText", parent ).offset().left, $( "#insertText", parent ).offset().top ];
            let newPosition = [ 0, 0 ];
            let space = 20;

            console.log( popSize );
            console.log( bodySize );
            console.log( clickInsertOffsets );
            console.log( insertSize );

            //если справа мы вышли за пределы экрана, то сдвигаем окно влево
            if ( clickInsertOffsets[0] + popSize[0] > bodySize[0] - space ) {
                newPosition[0] = clickInsertOffsets[0] - textParent[0] - popSize[0] + insertSize[0];
            }
            else {
                newPosition[0] = clickInsertOffsets[0] - textParent[0];
            }

            //Если снизу вышли за предел
            if ( clickInsertOffsets[1] + insertSize[1] + popSize[1] > bodySize[1] - space ) {
                newPosition[1] = clickInsertOffsets[1] - textParent[1] - popSize[1];
            }
            else {
                newPosition[1] = clickInsertOffsets[1] - textParent[1] + insertSize[1];
            }

            console.log( newPosition );

            $( pop ).css({
                "left" : newPosition[0] + "px",
                "top" : newPosition[1] + "px"
            }).addClass( "iTPopShow" );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function hidePop ( e ) {
        try {
            if ( !isShowPop ) {return;}

            delPopEvents();

            $( "#iTPop" ).removeClass( "iTPopShow" );
            clickInsertItemIndex = -1;
            isShowPop = false;
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addPopEvents ( ) {
        try {
            if ( !isShowPop ) {return;}

            $( document ).on( "click", checkHidePop );
            $( "#iTPop > .iTPItem" ).on( "click", clickPopItem );
        }
        catch ( err ) {
            console.log( err );
        }
    }
    function delPopEvents ( ) {
        try {
            if ( !isShowPop ) {return;}

            $( document ).on( "click", checkHidePop );
            $( "#iTPop > .iTPItem" ).off( "click", clickPopItem );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function clickPopItem ( e ) {
        try {
            if ( !isShowPop ) {return;}

            let clickInsertElem = $( "#insertText > * .iTItem[data-val=\"" + clickInsertItemIndex + "\"]", parent );

            if ( $( e.currentTarget ).attr( "data-val" ) === $( clickInsertElem ).attr( "data-set" ) ) {
                words[ $( clickInsertElem ).attr( "data-set" ) ][ "isFree" ] = true;
                $( clickInsertElem ).attr( "data-set", -1 ).removeClass( "iTItemFull" ).addClass( "iTItemEmpty" ).html( "" );
                updateWordsStatus ();
                updatePopItemsStatus ();

                return;
            }

            let clickPopItemIndex = $( e.currentTarget ).attr( "data-val" );

            if ( words.hasOwnProperty( $( clickInsertElem ).attr( "data-set" ) ) ) {
                words[ $( clickInsertElem ).attr( "data-set" ) ][ "isFree" ] = true;
            }

            $( "#insertText > * .iTItem[data-set=\"" + clickPopItemIndex + "\"]", parent ).html( "" ).removeClass( "iTItemFull" ).addClass( "iTItemEmpty" ).attr( "data-set", -1 );
            $( clickInsertElem ).html( words[ clickPopItemIndex ][ "word" ] ).attr( "data-set", clickPopItemIndex ).removeClass( "iTItemEmpty" ).addClass( "iTItemFull" );
            words[ clickPopItemIndex ][ "isFree" ] = false;
            updateWordsStatus ();
            updatePopItemsStatus ();
            hidePop();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function updatePopItemsStatus () {
        try {
            $( words ).each(function ( index, elem ) {
                if ( elem[ "isFree" ] === false ) {
                    $( "#iTPop > .iTPItem[data-val=\"" + index + "\"]" ).addClass( "iTPItemInactive" );
                }
                else {
                    $( "#iTPop > .iTPItem[data-val=\"" + index + "\"]" ).removeClass( "iTPItemInactive" );
                }
            } );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function updateWordsStatus () {
        try {
            $( words ).each(function ( index, elem ) {
                if ( elem[ "isFree" ] === false ) {
                    $( "#insertWords > .iWItem[data-val=\"" + index + "\"]" ).addClass( "iWItemUsed" );
                }
                else {
                    $( "#insertWords > .iWItem[data-val=\"" + index + "\"]" ).removeClass( "iWItemUsed" );
                }
            } );
            lineStatus.updateInsert();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function checkHidePop ( e ) {
        try {
            if ( $( e.target ).attr( "id" ) === "iTPop" || $( e.target ).parents( "#iTPop" ).length >= 1 || $( e.target ).hasClass( "iTItem" ) || $( e.target ).parents( ".iTItem" ).length >= 1 ) {
                return;
            }

            hidePop ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function build ( textData ) {
        try {
            $( "* > #iTPop > .iTPItem", parent ).remove();

            $( words ).each( function ( index, elem ) {
                $( "#insertWords", parent ).append( '<div class="iWItem" data-val="' + index + '">(' + (index + 1) + ') ' + elem[ "word" ] + ' -</div>' );
                $( "* > #iTPop", parent ).append( '<div class="iTPItem" data-val="' + index +'">(' + (index + 1) + ') ' + elem[ "word" ] + '</div>' );
            } );

            textData = textData.replace( /\[in\]*/g, '<span class="iTItem iTItemEmpty"></span>' );
            $( "#insertText", parent ).append( textData );

            $( "#insertText > * > .iTItem", parent ).each( function ( index, elem ) {
                $( elem ).attr( {
                    "data-val" : index,
                    "data-set" : -1
                } );
            } );

            $( "* > ", parent )
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function check ( index, isShowError, isCheckAll ) {
        try {
            if ( isCheckAll === null || isCheckAll === undefined ) {
                isCheckAll = true;
            }
            if ( isShowError === null || isShowError === undefined ) {
                isShowError = true;
            }
            if ( !isCheckAll && (index === null || index === undefined) ) {
                if ( isShowError ) {
                    alert( "Не передан индекс" );
                }

                return false;
            }

            let result = false;
            let count = 0, goodCount = 0;

            $( "#insertText > * > .iTItem" ).each ( function ( ind, elem ) {
                count++;

                if ( isCheckAll ) {
                    if ( words.hasOwnProperty( $( elem ).attr( "data-set" ) ) && words[ $( elem ).attr( "data-set" ) ][ "isFree" ] === false ) {
                        goodCount++;
                    }
                }
                else {
                    if ( $( elem ).attr( "data-val" ) === index ) {
                        console.log( words[ $( elem ).attr( "data-set" ) ] );
                        if ( !words.hasOwnProperty( $( elem ).attr( "data-set" ) ) || words[ $( elem ).attr( "data-set" ) ][ "isFree" ] === true ) {
                            if ( isShowError ) {
                                alert( "Необходимо заполнить пропуск под номером " + (index + 1) );
                            }

                            //return false;
                        }
                        else {
                            console.log( "успех" );
                            result = true;
                        }

                    }
                }
            } );

            if ( isCheckAll ) {
                if ( count === 0 || goodCount !== count ) {
                    if ( isShowError ) {
                        alert("Необходимо заполнить все пропуски в предложениях");
                    }

                    return false
                }

                return true;
            }
            else {
                return result;
            }
        }
        catch ( err ) {
            console.log( err );

            if ( isShowError ) {
                alert( "Ошибка: " + err );
            }

            return false;
        }
    }

    function results (  ) {
        try {
            let result = "";

            $( "#insertText > * > .iTItem", parent ).each( function ( index, insertElem ) {
                if ( parseInt($( insertElem ).attr( "data-set" )) !== -1 ) {
                    result += "," + ( parseInt( $( insertElem ).attr( "data-set" ) ) + 1 );
                }
                else {
                    result += ",0";
                }
            } );

            return result.substring( 1 );
        }
        catch ( err ) {
            console.log( err );

            return false;
        }
    }

    return {
        init : function ( parentElem, wordsArray, textData ) {
            init ( parentElem, wordsArray, textData );
        },
        check : function ( ) {
            return check ( null, true, true );
        },
        checkElem : function ( index ) {
            return check ( index, false, false );
        },
        results : function () {
            return results();
        }
    }
};

let video = new function () {
    let parent = null;
    let isPlay = false;
    let playCount = 0;

    function init ( parentElem ) {
        try {
            if (parentElem === undefined || parentElem === null ) {
                return;
            }

            parent = parentElem;

            addEvents ();
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function addEvents ( ) {
        try {
            $( "#vVButton", parent ).on( "click", play );
        }
        catch ( err ) {
            console.log( err );
        }
    }

    function play ( e ) {
        try {
            if ( isPlay ) {
                return;
            }

            isPlay = true;

            $( e.currentTarget ).addClass( "vVButtonInactive" );
            $( "video", parent ).on( "ended", end );
            $( "video", parent )[0].play();
        }
        catch ( err ) {
            console.log( err );

            isPlay = false;
        }
    }

    function end ( e ) {
        try {
            if ( !isPlay ) {
                return;
            }

            playCount++;

            if ( playCount === 2 ) {
                $( "*", parent ).remove();

                return;
            }

            $( "video", parent ).off( "ended", end );
            $( "video", parent )[0].currentTime = 0;
            $( "#vVButton", parent ).removeClass( "vVButtonInactive" );
            isPlay = false;
        }
        catch ( err ) {
            console.log( err );

            isPlay = false;
        }
    }

    return {
        init : function ( parentElem ) {
            init ( parentElem );
        }
    }
};