<%--
  Created by IntelliJ IDEA.
  User: Asus
  Date: 30.03.2021
  Time: 17:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <%@ include file="allLink.jsp" %>
    <title>Олимпиада</title>
    <link href="/resources/css/languages/testOlimp.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="main">
    <div id="startBoard">
        <button onclick="startOlimp()" id="startBtn">старт</button>
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/languages/jquery-3.3.1.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/languages/testPatterns.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/languages/testTesting.js"></script>
</body>
</html>
