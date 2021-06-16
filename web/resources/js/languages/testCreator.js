/*Определяет какой паттерн необходимо создать.
* После определения вызывет функцию созданиия у определённого паттерна*/
function createPattern( pattern ){
    switch (pattern){
        case "testingPatternForm":
            testingPattern.createForm();
            break;
        case "insertWordsPatternForm":
            insertWordsPattern.createForm();
            break;
        case "essayPatternForm":
            essayPattern.createForm();
            break;
        default:
            alert("Паттерн не найден");
    }

}

/*Функция размещается в кнопке закрытия паттерна <button class="closeButton">
* Удаляет паттерн с вложенным в функцию ID*/
function deletePattern(patternId){
    $("#part" + patternId).remove();
    patternsId.splice(patternsId.indexOf(patternId), 1);
}

/*Функция размещается в <button class="saveBtn">
* Собирает все введеные данные и проверяет их на валидность
* Если данные прошли проверку отправляет их на сервер через ajax запрос*/
function saveInstruction(){
    let testTemplate; //Финальная строка - инструкция
    let testName; //Название олимпиады
    let testTime;

    testName = $("#OlimpName").val();
    //проверка заполнения поля с названием олимпиады
    if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(testName)){
        alert("Название олимпиады не заполнено или неверного формата!");
        $("#OlimpName").focus();
        return false;
    }

    testTemplate = "testName="+testName; //Добовляем название олимпиады в инструкцию

    testTime = $("#testTime").val();
    if (!/^[0-9]+$/.test(testTime)){
        alert("Время выполнения не заполнено или неверного формата!");
        $("#testTime").focus();
        return false;
    }


    testTemplate = testTemplate + "&testTime=" + testTime; //Добовляем время прохождения олимпиады


    //должна быть создана, хотябы одна часть
    if (patternsId.length === 0){
        alert("Ни одной части не было создано!");
        return false;
    }

    let newPartId = 0; //новое id паттерна для инструкции
    /*** Только для testingPatternForm ***/
    let newQuestId = 0; //новое id вопроса для инструкции
    let newAnswerId = 0; //новое id ответа для инструкции
    /*************************************/
    let partPattern;
    let i = 0; //счетчик для цикла
    //добовляем все части в инструкцию
    for (i=0; i < patternsId.length; i++){

        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(document.getElementById("partName"+patternsId[i]).value)){
            alert("Название части не заполнено или неверного формата!");
            document.getElementById("partName"+patternsId[i]).focus();
            return false;
        }

        partPattern = document.getElementById("part"+patternsId[i]).className;
        //узнаем вид паттерна и вызываем соответствующаю функцию для сохранения
        switch (partPattern){
            //записываем данные для тестирования в инструкцию
            case "testingPatternForm":
                if (saveTestingPatternForm() === false) return false;
                break;
            case "insertWordsPatternForm":
                if (saveInsertWordsPatternForm() === false) return false;
                break;
            case "essayPatternForm":
                if (saveEssayPatternForm() === false) return false;
                break;
            default:
                alert("при сохранении паттерн тестирования не опознан!");
                console.log(partPattern);
                return false;
        }
    }

    console.log(testTemplate); //fixme вывод в консоль для проверки правильности инструкции
    //Передаем инструкцию на сервер
    //ajax запрос для отправки инструкции на сервер
    $.ajax({
        url: 'https://olimp.sgugit.ru/languages/testCreator',
        type: 'POST',
        dataType: 'html',
        data: encodeURI(testTemplate),
        error: function (req, text, error) {
            alert("Ошибка: " + error);
            console.error('Упс! Ошибочка: ' + text + ' | ' + error);
        },
        success: function (dataGet, status) {
            try {
                console.log(status);
            }
            catch ( err ) {
                console.log( err );
                alert( "Возникла ошибка: " + err );
            }
        }
    });

    function saveTestingPatternForm(){
        newPartId++;
        //запись части в инструкцию
        testTemplate = testTemplate + "&partT" + newPartId + "=" + partPattern;
        //Запись названия части
        let partName = document.getElementById("partName"+patternsId[i]).value;
        testTemplate = testTemplate + "&pName"+ newPartId + "=" + partName;
        //Ищем вопросы принадлежащие к части и добавляем в инструкцию
        for (let j=0; j < questsId.length; j++){
            try {
                let quest = document.getElementById(patternsId[i] + "quest" + questsId[j]).value;
                if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(quest)){
                    alert("Поле вопроса не заполнено или неверного формата!");
                    document.getElementById(patternsId[i] + "quest" + questsId[j]).focus();
                    return false;
                }
                newQuestId++;
                quest = "&" + newPartId +"quest"+ newQuestId + "=" + quest;
                testTemplate = testTemplate + quest;
                //ищем ответы для вопроса и записываем в инструкцию
                for (let k=0; k<answersId.length; k++){
                    try{
                        let answer = document.getElementById(questsId[j] + "answer" + answersId[k]).value;
                        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(answer)){
                            alert("Поле ответа не заполнено или неверного формата!");
                            document.getElementById(questsId[j] + "answer" + answersId[k]).focus();
                            return false;
                        }
                        newAnswerId++;
                        answer = "&" + newQuestId +"answer"+ newAnswerId +"="+ answer;
                        testTemplate = testTemplate + answer;
                    } catch (e){

                    }
                }
            }catch (e){

            }
        }
    }

    function saveInsertWordsPatternForm(){
        newPartId++;
        testTemplate = testTemplate + "&partT" + newPartId + "=" + partPattern;
        let partName = document.getElementById("partName"+patternsId[i]).value;
        testTemplate = testTemplate + "&pName"+ newPartId + "=" + partName;

        //Проверка правильно ли заполнено поле c текстом
        let textWithInserts = document.getElementById("textWS"+patternsId[i]).value;
        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-\[\]]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-\[\]]+)*$/.test(textWithInserts)){
            alert("Текст со вставками не заполнен или неверного формата!");
            document.getElementById("textWS"+patternsId[i]).focus();
            return false;
        }

        //Проверка на количество слов и вставок
        let partWords = [];
        for (let j=0; j < insertWords.length; j++){
            try{
                let selectWord = document.getElementById(patternsId[i] + "wordButton" + insertWords[j]).value;
                partWords.push(selectWord);
            } catch (e){

            }
        }
        let inCount = textWithInserts.match(/(\[IN\])/gm).length;
        if (!(inCount <= partWords.length)){
            alert("Колиичество вставок больше чем слов!")
            document.getElementById("textWS"+patternsId[i]).focus();
            return false;
        }

        testTemplate = testTemplate + "&textWS=" + textWithInserts;
        for (let j=0; j < partWords.length; j++){
            testTemplate = testTemplate + "&insertWord" + (j+1) + "=" + partWords[j];
        }

    }

    function saveEssayPatternForm(){
        newPartId++;
        testTemplate = testTemplate + "&partT" + newPartId + "=" + partPattern;
        let partName = document.getElementById("partName"+patternsId[i]).value;
        testTemplate = testTemplate + "&pName"+ newPartId + "=" + partName;

        let description = document.getElementById("description"+patternsId[i]).value;
        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(description)){
            alert("Описание Эссе не заполнено или неверного формата!");
            document.getElementById("description"+patternsId[i]).focus();
            return false;
        }
        testTemplate = testTemplate + "&description" + newPartId + "=" + description;

        let minWords = document.getElementById("minWords"+patternsId[i]).value;
        if (!/^[0-9]+$/.test(minWords)){
            alert("Минимальное количество символов не заполнено или неверного формата!");
            document.getElementById("minWords"+patternsId[i]).focus();
            return false;
        }
        testTemplate = testTemplate + "&minWords" + newPartId + "=" + minWords;

        let maxWords = document.getElementById("maxWords"+patternsId[i]).value;
        if (!/^[0-9]+$/.test(maxWords)){
            alert("Максимальное количество символов не заполнено или неверного формата!");
            document.getElementById("maxWords"+patternsId[i]).focus();
            return false;
        }
        testTemplate = testTemplate + "&maxWords" + newPartId + "=" + maxWords;
    }
}

/*функция вызывается в <button class="dropBtn">
Открывыет окно для выбора паттерна олимпиады*/
function getPatterns(){
    document.getElementById("myDropdown").classList.toggle("show");
}


window.onclick = function(event) {

    // Закрывает меню с паттерными если пользователь кликнул вне окна
    if (!event.target.matches('.dropBtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}