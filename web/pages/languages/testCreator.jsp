<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%@ include file="allLink.jsp" %>
    <title>Конструктор олимпиады</title>
    <link href="/resources/css/languages/testCreator.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="main">
    <div id="nameAndTimer">
        <input  type="text" class="cInputName" id="OlimpName" placeholder="Введите название теститирования">
        <div class="flex"><span>Введите время выполнения: </span>
            <input type="number" min="0" oninput="validity.valid||(value='');" class="numInput" id="testTime" placeholder="90"> <span>минут</span>
        </div>
    </div>

    <div class="dropdown" >
        <button onclick="getPatterns()" class="dropBtn">Создать часть тестирования</button>
        <div id="myDropdown" class="dropdown-content">
            <button class="pattern" onclick="createPattern('testingPatternForm')">Тестирование</button>
            <button class="pattern" onclick="createPattern('insertWordsPatternForm')">Вставка слов в текст</button>
            <button class="pattern" onclick="createPattern('essayPatternForm')">Эссе</button>
        </div>
    </div>

    <div id="parts">
    </div>

    <div>
        <button class="saveBtn" onclick="saveInstruction()">Сохранить олимпиаду</button>
    </div>

</div>

<script src="${pageContext.request.contextPath}/resources/js/languages/jquery-3.3.1.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/languages/testPatterns.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/languages/testCreator.js"></script>
</body>
</html>
