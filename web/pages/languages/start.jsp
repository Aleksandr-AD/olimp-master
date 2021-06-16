<%--
  Created by IntelliJ IDEA.
  User: Александр
  Date: 21.02.2019
  Time: 13:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="allMeta.jsp" %>
    <%@ include file="allLink.jsp" %>

    <title>Олимпиада по английскому, немецкому и русскому языкам в 2020 году - Начало</title>
    <style>
        video{

        }
    </style>
    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД ПО ЯЗЫКАМ СТИЛИ --%>
    <%@ include file="allStyles.jsp" %>

    <link href="/resources/css/languages/start.css" rel="stylesheet" type="text/css">
</head>
<body class="bodyBlock">


<div id="content">
    <div>
        <div class="rGText"> <!--rGText-->
            Нажимая на кнопку «скачать инструкцию» вы подтверждаете, что ознакомились с правилами олимпиады и соглашаетесь с условиями её проведения. <a id="Instruction" href="https://olimp.sgugit.ru/resources/files/instruction.docx" download="Инструкция.docx">Скачать инструкцию</a>
        </div>
    </div>



    <!-- ВАЖНО УБРАТЬ ПОСЛЕ ТЕСТА hideElem-->
    <div id="cCheckboxLabel" >
        Олимпиаду по какому языку вы будете сейчас проходить?
    </div>

    <div id="rCheckboxes" >
        <div>
            <div class="rCheckbox" data-val="русский" >
                <div class="rCBox"></div>
                <div class="rCText">русскому языку</div>
            </div>

            <div class="rCheckbox rCheckboxLast" data-val="немецкий">
                <div class="rCBox"></div>
                <div class="rCText">немецкому языку</div>
            </div>
        </div>

        <div>
            <div class="rCheckbox" data-val="английский">
                <div class="rCBox"></div>
                <div class="rCText">английскому языку</div>
            </div>
        </div>
    </div>

    <div id="cPartsLabel" >
        Задания олимпиады состоят из трех частей:
    </div>

    <div id="cParts">
        <div id="cP1" class="cPItem">
            Часть I:<span>-</span>.
        </div>

        <div id="cP2" class="cPItem">
            Часть II:<span>-</span>.
        </div>

        <div id="cP3" class="cPItem">
            Часть III:<span>-</span>.
        </div>
    </div>

    <div id="cTimes" >
        Общее время выполнения заданий - 90 минут. Успехов!
    </div>

    <div id="cBtn" >
        <div id="cBStart" >
            Начать олимпиаду
        </div>

        <div id="cBCreate" >
            конструктор
        </div>

        <div id="cBTest">
            тест новой олимпиады
        </div>
    </div>


    <div id="support">
        По всем вопросам пишите на <a href="mailto:olimpiada.sgugit@yandex.ru">olimpiada.sgugit@yandex.ru</a>
    </div>
</div>

<script src="/resources/js/languages/jquery-3.3.1.js"></script>
<script src="/resources/js/languages/start.js"></script>
</body>
</html>
