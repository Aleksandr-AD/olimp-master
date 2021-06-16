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

    <title>Олимпиада по английскому, немецкому и русскому языкам в 2020 году - Авторизация</title>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД ПО ЯЗЫКАМ СТИЛИ --%>
    <%@ include file="allStyles.jsp" %>

    <link href="/resources/css/languages/startAuth.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="content">
    <div id="cOvalLeft" class="cOval"></div>

    <div id="cOvalRight" class="cOval"></div>

    <div id="cHeader">
        АВТОРИЗАЦИЯ УЧАСТНИКА
    </div>

    <input type="number" class="cInput" min="1" id="cK" placeholder="Регистрационный номер">

    <input type="password" class="cInput" id="cS" placeholder="Пароль">

    <div id="cBtn">
        <div id="cBStart">
            Войти
        </div>
    </div>
</div>

<script src="/resources/js/languages/jquery-3.3.1.js"></script>
<script src="/resources/js/languages/startAuth.js"></script>
</body>
</html>
