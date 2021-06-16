let testInfo; //информация по олимпиаде
let olimpData; //информация для создания частей олимпиады
let partQuantity; //количество частей в олимпиаде
let currentPart; //действующая часть
let instruction; //инструкция для построения частей олимпиады
let pattern;

let testId = "87"; //id олимпиады, которую надо достать из базы данных

let testTime; //время полученное из бд (пока имитируеться)
let finalTime;
let timer;
let seconds;
let minutes;
/*Получает данные для построения олимпиады
* Проверяет была ли олимпиада уже начата*/
function loadOlimp(){
    testTesting.init();
    if (typeof getCookie("alreadyStart") === "undefined"){
        buildInfo();
    } else {
        startOlimp();
    }
}

let testTesting = new function (){
    //получает всю информацию по тестированию из бд
   function  init(){
       //запрос информации о тестировании
       console.log(new Date());
       testInfo = $.ajax({
            url: 'https://olimp.sgugit.ru/languages/testOlimp',
            async: false,
            type: 'POST',
            dataType: 'html',
            data: "command=loadOlimpInfo&olimpId="+ testId,
            error: function (req, text, error) {
                alert("Ошибка: " + error);
                console.error('Упс! Ошибочка: не удалось загрузить сопутствующаю информацию' + text + ' | ' + error);
            },
            success: function (dataGet, status) {
                try {
                    console.log("Запрос информации по олимпиаде: " + status);
                    return dataGet;
                }
                catch ( err ) {
                    console.log( err );
                    alert( "Возникла ошибка: " + err );
                }
            }
        }).responseText;
       console.log(testInfo);
       testInfo = testInfo.split("&");
       console.log(testInfo);
       testTime = testInfo[1].split("=")[1];

       //запрос инструкций для построения частей олимпиады
       olimpData = $.ajax({
            url: 'https://olimp.sgugit.ru/languages/testOlimp',
            async: false,
            type: 'POST',
            dataType: 'html',
            data: "command=loadOlimpParts&olimpId="+ testId,
            error: function (req, text, error) {
                alert("Ошибка: " + error);
                console.error('Упс! Ошибочка: не удалось загрузить части олимпиады' + text + ' | ' + error);
            },
            success: function (dataGet, status) {
                try {
                    console.log("Запрос инструкции для построения олимпиады: " + status);
                    return dataGet;
                }
                catch ( err ) {
                    console.log( err );
                    alert( "Возникла ошибка: " + err );
                }
            }
        }).responseText;
    }

    return{
        init: function (){
            init();
        }
    }
}

/*Строит информацию перед началом олимпиады*/
function buildInfo(){
    console.log("информация по олимпиаде: " + testInfo);//fixme

    document.getElementById("startBoard").insertAdjacentHTML("afterbegin",
        '<div class="info"><h3>'+testInfo[0].split("=")[1]+'</h3>' +
        '<span>у вас '+ testTime +' минут для прохождения</span>' +
        '</div>' +
        '<div></div>'
    );
}

/*Начинает тестирование*/
function startOlimp(){
    console.log("инструкция: " + olimpData); //fixme просмотр полученной инструкции
    document.getElementById("startBoard").remove();

    instruction = olimpData.split("partT"); //Записываем инструкцию для каждой части в массив

    instruction = instruction.filter(part => part.length > 0); //чистим массив от пустых значений

    partQuantity = instruction.length; //определяем количество частей олимпиады

    console.log("массив с инструкциями: ");//<<<2 fixme смотрим массив с инструкциями
    console.log(instruction);

    document.getElementById("main").insertAdjacentHTML("beforebegin",
        '<header>' +
        '<img src="/resources/images/languages/logo.png" alt="" />' +
        '<span>Сибирский государственный университет геосистем и технологий</span>' +
        '</header>'
        );

    document.getElementById("main").insertAdjacentHTML("beforeend",
        '<div id="olimpHeader">' +
        '<div id="timer"><span></span></div>' +
        '<span>'+testInfo[0].split("=")[1]+'</span>' +
        '</div>' +
        '<div id="part">' +
        '' +
        '</div>'
    );

    currentPart = getCookie("testPart");
    if (typeof currentPart === "undefined"){
        currentPart = 1;
        document.cookie ="testPart=" + currentPart;
    }
    buildPart();

    if (typeof getCookie("alreadyStart") === "undefined"){
        timer = setTimer();
    } else {
        timer = setTimerFromCooke();
        if (timer < 0){
            endTest();
        }
    }
    timerStart();
    document.cookie = "alreadyStart=true";

    document.getElementById("main").insertAdjacentHTML("beforeend",
        '<button onclick="nextPartOrFinish()" id="nextPartAndFinishBtn">Перейти к  следующей части</button>');

    if (Number(currentPart) === Number(partQuantity)){
        document.getElementById("nextPartAndFinishBtn").innerHTML ="Закончить олимпиаду";
    }

}

/*Строит часть тестирования*/
function buildPart(){

    let instructionForPart = instruction[currentPart-1].split("&");
    instructionForPart = instructionForPart.filter(part => part.length > 0);
    console.log("массив с текущей частью инструкции: ") //<<<2 fixme
    console.log(instructionForPart);

    pattern = instructionForPart[0].split("=")[1];
    console.log("название паттерна: " + pattern); // fixme
    switch (pattern){
        case "testingPatternForm":
            testingPattern.buildOlimpPart(instructionForPart);
            testingPattern.getAnswersOfCooke();
            break;
        case "insertWordsPatternForm":
            insertWordsPattern.buildOlimpPart(instructionForPart);
            insertWordsPattern.getAnswersOfCooke();
            break;
        case "essayPatternForm":
            essayPattern.buildOlimpPart(instructionForPart);
            essayPattern.getAnswersOfCooke();
            break;
        default:
            alert("ошибка в определении паттерна");
            return false
    }
}

/*Сохраняет ответы части в базе данных*/
function savePart(){
    let answers
    switch (pattern){
        case "testingPatternForm":
            answers = testingPattern.saveOlimpPart();
            break;
        case "insertWordsPatternForm":
            answers = insertWordsPattern.saveOlimpPart()
            if (answers === false) return false;
            break;
        case "essayPatternForm":
            answers = essayPattern.saveOlimpPart();
            if (answers === false) return false;
            break
        default:
            alert("паттерн для сохранения не определен");
            return false;
    }
    console.log(answers);
    $.ajax({
        url: 'https://olimp.sgugit.ru/languages/testOlimp',
        type: 'POST',
        dataType: 'html',
        data: "command=savePart&part="+ currentPart +"&answers="+ answers + "&testId=" + testId + "&userId=" + getCookie("userId"),
        error: function (req, text, error) {
            alert("Ошибка: " + error);
            console.error('Упс! Ошибочка: не удалось сохранить часть олимпиады' + text + ' | ' + error);
        },
        success: function (dataGet, status) {
            try {
                console.log("Сохранение части тестирования: " + status);
            }
            catch ( err ) {
                console.log( err );
                alert( "Возникла ошибка: " + err );
            }
        }
    });
}

/*Функция вызывается в <button id="nextPartAndFinishBtn">
* Определяет нужно ли продолжить или завершить тестирование
* После выполняет одно из действий*/
function nextPartOrFinish(){
    let agreed;
    if (Number(currentPart) === Number(partQuantity)){
        agreed = confirm("Сохранить ответы и завершить тестирование?");
        if (agreed){
            if (savePart() === false) return false;
            endTest();
        }
    } else {
        agreed = confirm("Сохранить ответы и перейти к следующей части?");
        if (agreed){
            if (savePart() === false) return false;
            document.getElementById("part").innerHTML = "";
            currentPart++;
            document.cookie = "testPart=" + currentPart;
            if (currentPart === partQuantity){
                document.getElementById("nextPartAndFinishBtn").innerHTML ="Закончить олимпиаду";
            }
            essayPattern.deleteCooke();
            buildPart();
        }
    }
}

/*Устанавливает таймер*/
function setTimer(){
    let startTime = new Date();
    finalTime = startTime.getTime();
    finalTime = finalTime + testTime * 60 * 1000;
    let sessionTime = Math.abs(finalTime - startTime.getTime());
    document.cookie = "completionTime=" + finalTime;
    return sessionTime / 1000;
}

/*Берёт таймер из куки и устанавливает*/
function setTimerFromCooke(){
    finalTime = getCookie("completionTime");
    let startTime = new Date();
    return (finalTime - startTime.getTime()) / 1000;
}

/*Запускает таймер*/
function timerStart(){
    let sessionTimer = setInterval(function (){
        seconds = Math.trunc(timer%60);
        minutes = Math.trunc(timer/60);
        if (timer < 0){
            savePart();
            endTest();
        } else {
            $("#timer > span").replaceWith("<span> "+minutes+" : "+seconds+"</span>");
        }

        --timer;
    }, 1000);
}

/*Заканчивает тестирование и удаляет куки*/
function endTest(){
    alert("Тестирование Завершено!");
    document.cookie = "testPart=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "alreadyStart=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "completionTime=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    testingPattern.deleteCooke();
    insertWordsPattern.deleteCooke();
    essayPattern.deleteCooke()
    window.open("/languages/start", "_parent");
}

//Получает куку с вложеным названием
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

window.onclick = function(event) {

    if (event.target.matches('.insertButton')){
        selectedWordId = event.target.id;
        /*console.log("clientY " + event.clientY);
        console.log("pageY " + event.pageY);
        console.log(document.getElementById("dropDownWordsList").clientHeight);

        let topY = event.clientY;
        let leftX = event.clientX;
        let Y = topY - (topY + document.getElementById("dropDownWordsList").pageY - document.body.clientHeight);
        document.getElementById("dropDownWordsList").style.top = Y + "px";
        document.getElementById("dropDownWordsList").style.left = Number(leftX) +"px";*/
    }

    if (!event.target.matches('.insertButton')) {

        let dropdowns = document.getElementsByClassName("wordsList");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//При открытии страницы, загружает олимпиаду
$(loadOlimp());
