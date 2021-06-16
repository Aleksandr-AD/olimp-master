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

    <title>Олимпиада по английскому, немецкому и русскому языкам в 2020 году - Русский язык</title>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД ПО ЯЗЫКАМ СТИЛИ --%>
    <%@ include file="allStyles.jsp" %>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД С ЗАДАНИЯМИ СТИЛИ --%>
    <%@ include file="allTestPageStyles.jsp" %>

    <link href="/resources/css/languages/testTest.css" rel="stylesheet" type="text/css">
    <link href="/resources/css/languages/testAllAnswer.css" rel="stylesheet" type="text/css">
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
<script src="/resources/js/languages/russian.js"></script>
</body>
</html>
