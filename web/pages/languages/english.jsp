<%--
  Created by IntelliJ IDEA.
  User: Александр
  Date: 22.02.2019
  Time: 8:52
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="allMeta.jsp" %>
    <%@ include file="allLink.jsp" %>

    <title>Олимпиада по английскому, немецкому и русскому языкам в 2020 году - Английский язык</title>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД ПО ЯЗЫКАМ СТИЛИ --%>
    <%@ include file="allStyles.jsp" %>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД С ЗАДАНИЯМИ СТИЛИ --%>
    <%@ include file="allTestPageStyles.jsp" %>

    <link href="/resources/css/languages/testInsert.css" rel="stylesheet" type="text/css">
    <link href="/resources/css/languages/testVideo.css" rel="stylesheet" type="text/css">
    <link href="/resources/css/languages/testTest.css" rel="stylesheet" type="text/css">
    <link href="/resources/css/languages/testText.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="content">
    <%@ include file="allTestPageHeader.jsp" %>

    <div id="cMain">
        <div id="testHeader">
            <div id="timerHeader" class="timer" data-val="<% out.print(request.getSession( true ).getAttribute( "time" )); %>">
                <div class="tI tM1">
                    <span>6</span>
                </div>
                <div class="tI tM2">
                    <span>0</span>
                </div>

                <span>:</span>

                <div class="tI tS1">
                    <span>0</span>
                </div>
                <div class="tI tS2">
                    <span>0</span>
                </div>
            </div>

            <span>
                Олимпиада по русскому языку 2020
            </span>
        </div>

        <div class="part" id="part">
            <div id="partHeader">
                <span>
                    ЧАСТЬ III
                </span>
            </div>



            <!--<div id="pFirst">
                <div class="tItem">
                    <div class="tINumber">Вопрос 1 из 20</div>

                    <div class="tIQuest">... you afraid of spiders? - Of course, no!</div>

                    <div class="tIAnswers">
                        <div class="tIAItem">
                            <div class="tIAISelect"></div> <span>are</span>
                        </div>

                        <div class="tIAItem">
                            <div></div> <span>is</span>
                        </div>

                        <div class="tIAItem">
                            <div></div> <span>am</span>
                        </div>

                        <div class="tIAItem">
                            <div></div> <span>be</span>
                        </div>
                    </div>
                </div>
            </div>-->
            <!--<div id="pThree">
                <div id="textHead">
                    Напишите эссе на тему: Поэзия России конца IXX века, какие произведения вам нравятся и почему?
                </div>

                <div id="textWords">
                    <div id="tWNeed">
                        Объём работы - от<span id="tWNFrom">200</span>до<span id="tWNTo">220</span>слов.
                    </div>

                    <div id="tWCurrent">
                        Количество слов:<span>27</span>
                    </div>
                </div>

                <textarea id="textText"></textarea>
            </div>-->
            <!--<div id="pSecond">
                <div id="audHead">
                    Прослушайте аудиозапись и выполните тестовое задание. Запись будет доступна для прослушивания не более 2-х раз
                </div>

                <div id="audSound">
                    <audio preload="auto">
                        <source src="/resources/sounds/languages/english.mp3">
                    </audio>
                </div>

                <div id="audTest">

                </div>
            </div>-->
            <!--<div id="pSecond">
                <div class="allAnswerItem">
                    <div class="aAIQuest">
                        Укажите, какого рода выделенные существительные в предложениях: Невеж не любят. Прокурором было подписано новое обвинительное заключение.
                    </div>

                    <textarea class="aAIA"></textarea>
                </div>

                <div class="allAnswerItem">
                    <div class="aAIQuest">
                        Укажите, какого рода выделенные существительные в предложениях: Невеж не любят. Прокурором было подписано новое обвинительное заключение.
                    </div>

                    <textarea class="aAIA"></textarea>
                </div>
            </div>-->
        </div>

        <%-- ОБЩЯЯ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД С ЗАДАНИЯМИ КНОПКА --%>
        <%@ include file="allTestPageButton.jsp" %>
    </div>
</div>

<div id="lineStatuses">
    <div>
    </div>

    <div class="lSSet">
    </div>

    <div>
    </div>

    <div>
    </div>

    <div>
    </div>

    <div class="lSSet">
    </div>

    <div class="lSSet">
    </div>

    <div class="lSSet">
    </div>
</div>

<script src="/resources/js/languages/jquery-3.3.1.js"></script>
<script src="/resources/js/languages/allTest.js"></script>
<script src="/resources/js/languages/english.js"></script>
</body>
</html>
