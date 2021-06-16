//общие для всех паттернов переменные:
let patternId = 0; // не занятый id паттерна
let patternsId = []; // пул созданных паттернов

/***testingPattern***/

//переменные для testCreator.jsp
let questId = 0; // не занятый id вопроса
let questsId = []; // пул вопросов
let answerId = 0; //не занятый id ответа
let answersId = []; //пул ответов

//переменные для testTesting.jsp
let radioNames;
let questCount = 0;

// *ТЕСТ*
let testingPattern = new function(){
    /*******************************
    функции для testCreator.jsp VVV*/

    //Создание паттерна тестирования
    function createForm(){
        patternId++;
        patternsId.push(patternId);

        $("#parts").append(
        '<div class="testingPatternForm" id="part' + patternId + '">' +
        '   <div class="patternBar">' +
        '       <input  type="text" class="cInput" id="partName'+patternId+'" placeholder="Название Тестирования">' +
        '       <button class="creatQuestButton" id="'+patternId+'" onclick="testingPattern.createQuest('+patternId+')">Создать вопрос</button>' +
        '       <button class="closeButton" id="'+patternId+'" onclick="deletePattern('+patternId+')">X</button>' +
        '   </div>' +
        '   <div id="questBlock'+patternId+'">' +
        '   </div>' +
        '</div>'
        );
    }

    //создает вопрос в паттерне тестирования
    function createQuest(patternId){
        questId++;
        questsId.push(questId);
        document.getElementById("questBlock"+patternId).insertAdjacentHTML("beforeend",
            '<div class="questDiv" id="questDiv'+questId+'">' +
            '   <div class="questBar">' +
            '       <textarea  class="questInput" id="'+patternId+'quest'+questId+'" placeholder="Введите вопрос"></textarea>' +
            '       <button class="creatAnswerButton" id="answerB'+questId+'" onclick="testingPattern.createAnswer('+questId+')">Создать ответ</button>' +
            '       <button class="closeButton"  id="quest'+questId+'" onclick="testingPattern.deleteQuest('+questId+')">X</button>' +
            '   </div>' +
            '</div>'
        );
    }

    //удаляет вопрос в паттерне тестирования
    function deleteQuest(questId){
        document.getElementById("questDiv"+questId).remove();
        questsId.splice(questsId.indexOf(questId), 1);
    }

    //создает ответ в вопросе
    function createAnswer(questId){
        answerId++;
        answersId.push(answerId);
        document.getElementById("questDiv"+questId).insertAdjacentHTML("beforeend",
            '<div class="answerDiv" id="answerDiv'+answerId+'">' +
            '<input  type="text" class="answerInput" id="'+questId+'answer'+answerId+'" placeholder="Введите ответ">' +
            '<button class="closeButton"  id="quest'+questId+'" onclick="testingPattern.deleteAnswer('+answerId+')">X</button>' +
            '</div>'
        );
    }

    //удаляет ответ в вопросе
    function deleteAnswer(answerId){
        document.getElementById("answerDiv"+answerId).remove();
        answersId.splice(answersId.indexOf(answerId), 1);
    }

    /******************************
    функции для testTesting.jsp VVV*/

    function radioClick(name , value){
        document.cookie = "R" + name + "=" + value;
    }

    function getAnswersOfCooke(){
        for (let i=0; i < radioNames.length; i++){
            console.log(getCookie("R"+ radioNames[i]));
            $('input[name='+ radioNames[i] +'][value='+ getCookie("R"+radioNames[i]) +']').prop('checked', true);

        }
    }

    function deleteCooke(){
        if (questCount !== 0){
            for (let i = 1; i <= questCount; i++){
                document.cookie = "R"+ i +"=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    }

    //отображение части "тестирование"
    function buildOlimpPart(instructionForPart){
        radioNames = [];
        let patternName = instructionForPart[1].split("=")[1];

        document.getElementById("part").insertAdjacentHTML("beforeend",
            '<span>'+ patternName +'</span>' +
            '<div id="questsDiv">' +
            '</div>'
        );

        let answerValue = 1;
        let currentName = "";
        for (let i=2; i < instructionForPart.length; i++){
            let element = instructionForPart[i].split("=")[0]
            let elementContent = instructionForPart[i].split("=")[1];

            if (element.includes("quest")){
                questCount++;
                let id = element.split("quest")[1];
                answerValue = 1;
                document.getElementById("questsDiv").insertAdjacentHTML("beforeend",
                    '<div class="quest" id="quest'+ id +'">' +
                    '   <div class="questText">' +
                    '       <span>'+ elementContent +'</span>' +
                    '   </div>' +
                    '   <div class="answer" id="answers'+ id +'">' +
                    '   </div>' +
                    '</div>');

            } else if (element.includes("answer")){

                let idQ = element.split("answer")[0];
                let idA = element.split("answer")[1];
                if (currentName === "" || !(currentName === idQ)){
                    currentName =idQ;
                    radioNames.push(idQ);
                }

                document.getElementById("answers" + idQ).insertAdjacentHTML("beforeend",
                    '<div class="answerBox">' +
                    '<input type="radio" onclick="testingPattern.radioClick('+ idQ +','+ answerValue +')" name="'+ idQ +'" value="'+ answerValue +'" id="'+ idA +'">'+ elementContent +'<Br>' +
                    '</div>');

                answerValue++;

            } else {
                console.log("элемент не определен");
            }
        }
        console.log("Массив с radio name: "); //<<<2 fixme
        console.log(radioNames);
    }

    function saveOlimpPart(){
        let answers = "";
        let answer;
        for (let i = 0; i < radioNames.length; i++){
            answer = $('input[name='+radioNames[i]+']:checked').val();
            if (typeof answer == "undefined"){
                answers += "0";
            } else {
                answers += answer;
            }
        }
        console.log("ответы на тест: " + answers);
        return answers;
    }

    return{
        radioClick: function (name, value){
            radioClick(name, value);
        },
        createForm: function (){
            createForm();
        },
        buildOlimpPart: function (instructionForPart){
            buildOlimpPart(instructionForPart);
        },
        createAnswer: function (questId){
            createAnswer(questId);
        },
        deleteQuest: function (questId){
            deleteQuest(questId)
        },
        createQuest: function (patternId){
            createQuest(patternId);
        },
        deleteAnswer: function (answerId){
            deleteAnswer(answerId);
        },
        saveOlimpPart: function (){
            return saveOlimpPart();
        },
        getAnswersOfCooke: function (){
            getAnswersOfCooke();
        },
        deleteCooke: function (){
            deleteCooke();
        }
    }
};

/***insertWordsPattern***/

//переменные для testCreator.jsp
let insertWord = 0;
let insertWords = [];

//переменные для testTesting.jsp
let spacesForInserts = [];
let wordsForInserts = [];
let selectedWordId = "...";

// *ЗАПОЛНЕНИЕ ПРОПУСКОВ*
let insertWordsPattern = new function(){
    /*******************************
     функции для testCreator.jsp VVV*/

    function createForm(){
        patternId++;
        patternsId.push(patternId);
        $("#parts").append(
            '<div class="insertWordsPatternForm" id="part' + patternId + '">' +
            '   <div class="patternBar">' +
            '   <input  type="text" class="cInput" id="partName'+patternId+'" placeholder="Название вставки слова">' +
            '   <button class="insertButton" id="insertButton" onclick="insertWordsPattern.addInsert('+patternId+')">Добавить вставку</button>' +
            '   <button class="closeButton" id="'+patternId+'" onclick="deletePattern('+patternId+')">X</button>' +
            '   </div>' +
            '<textarea rows="10" class="textWS" id="textWS'+patternId+'" placeholder="Текст с пропущенными словами"></textarea>' +
            '   <div class="patternBar">' +
            '   <input type="text" class="wordInput" id="wordInput'+patternId+'" placeholder="Введите слово">' +
            '   <button class="addWordButton" onclick="insertWordsPattern.addWord('+patternId+')">Добавить слово</button>' +
            '   </div>' +
            '   <div class="patternBarForWords" id="wordsForInput'+patternId+'">' +
            '   </div>' +
            '</div>'
        )
    }

    function addInsert(textWSId){
        document.getElementById("textWS" + textWSId).value = document.getElementById("textWS" + textWSId).value + "[IN]";
        document.getElementById("textWS"+textWSId).focus();
    }

    function addWord(currentPatternId){
        insertWord++;
        insertWords.push(insertWord);
        let text = document.getElementById("wordInput" + currentPatternId).value;
        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.’!?:"'\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.’!?:"'\-]+)*$/.test(text)){
            alert("Поле для слова не заполнено или неверного формата!");
            document.getElementById("wordInput" + currentPatternId).focus();
            return false;
        }

        document.getElementById("wordsForInput" + currentPatternId).insertAdjacentHTML("beforeend",
            '<button class="wordButton" id="'+currentPatternId+'wordButton'+insertWord+'" value="'+text+'" onclick="insertWordsPattern.deleteWord('+insertWord+','+currentPatternId+')">'+text+'</button>'
            );
        document.getElementById("wordInput" + currentPatternId).value = "";
        document.getElementById("wordInput" + currentPatternId).focus();
    }

    function deleteWord(insertWordId, currentPatternId){
        document.getElementById(currentPatternId + "wordButton" + insertWordId).remove();
        insertWords.splice(insertWords.indexOf(insertWord), 1);
    }

    /******************************
     функции для testTesting.jsp VVV*/

    function buildOlimpPart(instructionForPart){

        let patternName = instructionForPart[1].split("=")[1];
        let text = instructionForPart[2].split("=")[1];
        let finalText='';
        text = text.split('\n');
        for (let i = 0; i < text.length; i++){
            text[i] = text[i] + '<br/>';
            finalText =finalText + '<p>' + text[i];
        }
        let inCount = finalText.match(/(\[IN\])/gm).length;
        for (let i = 0; i < inCount; i++){
            finalText = finalText.replace(/(\[IN\])/, '<button onclick=\"insertWordsPattern.showList()\" value=\"0\" class=\"insertButton\" id=\"insertButton'+ (i+1) +'\">...</button>');
            spacesForInserts.push("...");
        }
        console.log(finalText)

        document.getElementById("part").insertAdjacentHTML("beforeend",
            '<span>'+ patternName +'</span>' +
            '<div id="insertDiv">' +
            '   <div id="dropDownWordsList" class="wordsList"></div>' +
            '   <div id="wordsForInsert" class="wordsForInsert"></div>' +
            '   <div class="flexText">'+ finalText +'</div>' +
            '</div>'
            );

        let wordsCount = 1;
        for (let i = 3; i < instructionForPart.length; i++){
            let word = instructionForPart[i].split("=")[1];
            document.getElementById("dropDownWordsList").insertAdjacentHTML("beforeend",
                '<button onclick="insertWordsPattern.selectWord('+ "\'" + word + "\'" +', '+ wordsCount +')" class="insertWord" id="insertWord'+wordsCount+'" value="'+ word +'">'+ word +'</button>'
            );
            document.getElementById("wordsForInsert").insertAdjacentHTML("beforeend",
                '<div class="wordForInsert" id="wordForInsert'+ wordsCount +'">'+ instructionForPart[i].split("=")[1] +'</div>'
            );
            wordsForInserts.push(wordsCount);
            wordsCount++;
        }
    }

    function showList(){
        document.getElementById("dropDownWordsList").classList.toggle("show");
    }

    function selectWord(word, id){
        let wordId = Number(selectedWordId.split("insertButton")[1]);
        console.log(word);
        console.log(id);
        for (let i = 0; i < spacesForInserts.length; i++){
            let insertButtonValue = Number(document.getElementById("insertButton" + Number(i+1)).value);
            if (Number(id) === Number(insertButtonValue)){
                document.getElementById("insertButton" + Number(i+1)).value = 0;
                document.getElementById("insertButton" + Number(i+1)).textContent = "...";
                spacesForInserts[i] = "...";
                document.cookie = "insertButton" + Number(i+1) + "=..." + "," + 0;
            }
        }

        spacesForInserts[Number(wordId) - 1] = word;
        document.getElementById("insertButton" + wordId).value = id;
        document.getElementById("insertButton" + wordId).textContent = word;
        document.cookie = "insertButton" + wordId + "=" + word + "," + id;

        for (let i = 0; i < wordsForInserts.length; i++){
            document.getElementById("wordForInsert" + Number(i+1)).style.backgroundColor = "#f9ce62";
            document.getElementById("insertWord" + Number(i+1)).style.backgroundColor = "#f9ce62";
            for (let j = 0; j < spacesForInserts.length; j++){
                let insertButtonValue = Number(document.getElementById("insertButton" + Number(j+1)).value);
                if (Number(wordsForInserts[i]) === Number(insertButtonValue) ){
                    document.getElementById("wordForInsert" + Number(insertButtonValue)).style.backgroundColor = "#bdbdbd";
                    document.getElementById("insertWord" + Number(insertButtonValue)).style.backgroundColor = "#bdbdbd";
                }
            }
        }
        console.log(spacesForInserts);
    }

    function saveOlimpPart(){
        let answer = "";
        let agreed = false;
        let saveAgreed = false;

        for (let i = 0; i < spacesForInserts.length; i++){
            if ((spacesForInserts[i] === "...") && !saveAgreed){
                agreed = confirm("Не все пропуски заполнены. Вы точно хотите продолжить?")
                if (!agreed){
                    return false;
                } else {
                    saveAgreed = true;
                }
            }

            answer = answer + spacesForInserts[i] + ";"
        }
        answer = answer.substring(0, answer.length - 1);
        return answer;
    }

    function getAnswersOfCooke(){
        for (let i = 0; i < spacesForInserts.length; i++){
            let cookie = getCookie("insertButton" + Number(i+1));
            console.log(cookie);
            if (typeof cookie !== "undefined" && Number(cookie.split(",")[1]) !== 0){
                spacesForInserts[i] = cookie.split(",")[0];
                document.getElementById("insertButton" + Number(i+1)).innerHTML = cookie.split(",")[0];
                document.getElementById("insertButton" + Number(i+1)).value = cookie.split(",")[1];
                document.getElementById("wordForInsert" + Number(document.getElementById("insertButton" + Number(i+1)).value)).style.backgroundColor = "#bdbdbd";
            } else {
                spacesForInserts[i] = "...";
            }
        }
    }

    function deleteCooke(){
        for (let i = 0; i < spacesForInserts.length; i++){
            document.cookie = "insertButton" + Number(i+1) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    return{
        createForm: function (){
            createForm();
        },
        addInsert: function (textWSId){
            addInsert(textWSId);
        },
        addWord: function (wordsForInputId){
            addWord(wordsForInputId)
        },
        deleteWord: function (insertWordId, currentPatternId){
            deleteWord(insertWordId, currentPatternId);
        },
        buildOlimpPart: function (instructionForPart){
            buildOlimpPart(instructionForPart);
        },
        showList: function (){
            showList();
        },
        selectWord: function (word, id){
            selectWord(word, id);
        },
        saveOlimpPart: function (){
            return saveOlimpPart();
        },
        getAnswersOfCooke: function (){
            getAnswersOfCooke();
        },
        deleteCooke: function (){
            deleteCooke();
        }
    }
};

/***essayPattern***/

//переменные для testTesting.jsp
let wordCounter = 0;
let minW;
let maxW;

// *ЭССЕ*
let essayPattern = new function(){
    /*******************************
     функции для testCreator.jsp VVV*/

    function createForm(){
        patternId++;
        patternsId.push(patternId);

        $("#parts").append(
            '<div class="essayPatternForm" id="part' + patternId + '">' +
            '   <div class="patternBar">' +
            '   <input  type="text" class="cInput" id="partName'+patternId+'" placeholder="Название эссе">' +
            '   <button class="closeButton" id="'+patternId+'" onclick="deletePattern('+patternId+')">X</button>' +
            '   </div>' +
            '<textarea rows="10" class="descriptionInput" id="description'+patternId+'" placeholder="Описание эссе"></textarea>' +
            '   <div class="patternBar">' +
            '       <div class="patternBar"><span>Минимальное колличество слов:</span><input type="number" min="0" oninput="validity.valid||(value=\'\');" class="numInput" id="minWords'+patternId+'"></div>' +
            '       <div class="patternBar"><span>Максимальное колличество слов:</span><input type="number" min="0" oninput="validity.valid||(value=\'\');" class="numInput" id="maxWords'+patternId+'"></div>' +
            '   </div>' +
            '</div>'
        )
    }

    /******************************
     функции для testTesting.jsp VVV*/

    function buildOlimpPart(instructionForPart){
        let patternName = instructionForPart[1].split("=")[1];
        let text = instructionForPart[2].split("=")[1];
        let finalText='';
        text = text.split('\n');
        for (let i = 0; i < text.length; i++){
            text[i] = text[i] + '<br/>';
            finalText =finalText + '<p>' + text[i];
        }
        minW = instructionForPart[3].split("=")[1];
        maxW = instructionForPart[4].split("=")[1];
        document.getElementById("part").insertAdjacentHTML("beforeend",
            '<span>'+ patternName +'</span>' +
            '<div id="essayDiv">' +
            '   <div class="flexText">'+ finalText +'</div>' +
            '<textarea rows="14" class="essayText" id="essayText" oninput="essayPattern.countWords()"></textarea>' +
            '   <div id="countBar">' +
            '       <div class="countBarPart">Минимальное количество слов: '+ minW +'</div>' +
            '       <div class="countBarPart">Текущее количество слов: &nbsp<div id="wordCounter">'+ wordCounter +'</div></div>' +
            '       <div class="countBarPart">Максимальное количество слов: '+ maxW +'</div>' +
            '   </div>' +
            '</div>'
        );
    }

    function countWords(){
        let words = document.getElementById("essayText").value;
        wordCounter = words.split(" ");
        wordCounter = wordCounter.filter(word => word.length > 0).length;
        $("#wordCounter").empty();
        document.getElementById("wordCounter").insertAdjacentHTML("afterbegin", ''+wordCounter+'');
        document.cookie = "essayText=" + words;
    }

    function deleteCooke(){
        document.cookie = "essayText=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        wordCounter = 0 ;
    }

    function getAnswersOfCooke(){
        if (typeof getCookie("essayText") !== "undefined"){
            document.getElementById("essayText").value = getCookie("essayText");
            countWords();
        }
    }

    function saveOlimpPart(){
        if ( (Number(wordCounter) < Number(minW)) ){
            alert("Недостаточно слов!");
            return false;
        }
        console.log(Number(wordCounter));
        console.log(Number(maxW));
        if ( (Number(wordCounter) > Number(maxW)) ){
            alert("Превышено количество слов!");
            return false;
        }

        let answer = document.getElementById("essayText").value;

        if (!/^[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+(\s[а-яёА-ЯЁ0-9a-zA-Z,.!?:"\-]+)*$/.test(answer)){
            alert("В тексте присутствуют запрещенные знаки или лишние пробелы!");
            return false;
        }

        return answer;
    }

    return{
        createForm: function (){
            createForm();
        },
        buildOlimpPart: function (instructionForPart){
            buildOlimpPart(instructionForPart);
        },
        countWords: function (){
            countWords();
        },
        saveOlimpPart: function (){
            return saveOlimpPart();
        },
        deleteCooke: function (){
            deleteCooke();
        },
        getAnswersOfCooke: function (){
            getAnswersOfCooke();
        }
    }
};

// функция для взятия куки
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}




