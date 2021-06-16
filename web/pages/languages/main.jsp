<%--
  Created by IntelliJ IDEA.
  User: Александр
  Date: 21.02.2019
  Time: 8:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    Boolean isLKuser = request.getSession().getAttribute( "lkData" ) != null && request.getSession().getAttribute( "lkData" ).equals( "ok" );
%>

<html>
<head>
    <%@ include file="allMeta.jsp" %>
    <%@ include file="allLink.jsp" %>

    <title>Олимпиада по английскому, немецкому и русскому языкам в 2020 году</title>

    <%-- ОБЩИЕ ДЛЯ ВСЕХ СТРАНИЦ ОЛИМПИАД ПО ЯЗЫКАМ СТИЛИ --%>
    <%@ include file="allStyles.jsp" %>

    <link href="/resources/css/languages/main.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="main" class="hideElem">
    <header>
        <div id="hTopSmall" class="hSmall hTopLine"></div>
        <div id="hTopBig" class="hBig hTopLine"></div>

        <img src="/resources/images/languages/logo.png" alt="" />

        <span>Сибирский<br/>государственный университет<br/>геосистем и технологий</span>

        <div id="hBottomBig" class="hBig hBottomLine"></div>
        <div id="hBottomSmall" class="hSmall hBottomLine"></div>
    </header>

    <div id="info">
        <span id="iLabel">
            ОЛИМПИАДА
        </span>

        <span id="iSublabel">
            по английскому, немецкому и русскому языкам в 2020 году
        </span>

        <span id="iDates">
            С 11 ноября по 13 ноября
        </span>
    </div>

    <div id="reg">
        <div id="rHead" class="rMar">
            <div id="rHLeft" class="rHOval"></div>

            <span>
                РЕГИСТРАЦИЯ УЧАСТНИКА<br>
            </span>

            <div id="rHRight" class="rHOval"></div>
        </div>

        <div id="rStudInfo" style="display: none;">
            *Обучающиеся СГУГиТ регистрируются через свой личный кабинет на <a href="https://lk.sgugit.ru" target="_parent">https://lk.sgugit.ru</a>
        </div>

        <!-- ***данные о студенте*** -->
        <div id="rInputs">
            <div class="rIItem">
                <span>
                    Фамилия
                </span>

                <div>
                    <input id="rIF" type="text">
                </div>
            </div>

            <div class="rIItem">
                <span>
                    Имя
                </span>

                <div>
                    <input id="rIN" type="text" >
                </div>
            </div>


            <div class="rIItem">
                <span>
                    Отчество
                </span>

                <div>
                    <input id="rIO" type="text">
                </div>
            </div>

            <div class="rIItem">
                <span>
                    Город
                </span>

                <div>
                    <input id="rIT" type="text">
                </div>
            </div>

            <div class="rIItem">
                <span>
                    Университет
                </span>

                <div>
                    <input id="rIU" type="text">
                </div>
            </div>
            <div class="rHHText">
                *указать полное название университета.
            </div>

            <div class="rIItem">
                <span>
                    Направление<br/>(специальность)
                </span>

                <div>
                    <input id="rIS" type="text">
                </div>
            </div>

            <div class="rIItem">
                <span>
                    Институт/Факультет
                </span>

                <div>
                    <input id="rIIF" type="text" placeholder="Сибирский госу...">
                </div>
            </div>

            <div class="rHHText">
                *указать полное название института.
            </div>

            <div class="rIItem">
                <span>
                    № Группы
                </span>

                <div>
                    <input id="rIG" type="text">
                </div>
            </div>
            <!-- E-Mail студента id=rMail -->
            <div class="rIItem">
                <span>
                    Адрес эл.почты
                </span>

                <div>
                    <input id="rMail" type="email">
                </div>
            </div>
            <!-- номер телефона студента id=rPhone -->
            <div class="rIItem">
                <span>
                    Номер телефона
                </span>

                <div>
                    <input id="rPhone" type="number" placeholder="9998884433">
                </div>
            </div>
            <!-- пароль студента -->
            <div class="rIItem">
                <span>
                    Пароль
                </span>

                <div>
                    <input id="pass" type="text">
                </div>
            </div>
            <!--повторить пароль студента -->
            <div class="rIItem">
                <span>
                    Повторите пароль
                </span>

                <div>
                    <input id="rePass" type="text">
                </div>
            </div>

            <!-- ***данные о преподавателе*** -->
            <div class="rGText">
                    Данные о преподавателе:
            </div>
            <!-- имя преподавателя id= prFName-->
            <div class="rIItem">
                <span>
                    Имя
                </span>

                <div>
                    <input id="prFName" type="text">
                </div>
            </div>
            <!-- фамилия преподавателя id= prLName-->
            <div class="rIItem">
                <span>
                    Фамилия
                </span>

                <div>
                    <input id="prLName" type="text">
                </div>
            </div>
            <!-- отчество преподавателя id= prPatronymic-->
            <div class="rIItem">
                <span>
                    Отчество
                </span>

                <div>
                    <input id="prPatronymic" type="text">
                </div>
            </div>
            <!-- должность преподавателя id=prPosition -->
            <div class="rIItem">
                <span>
                    Должность
                </span>

                <div>
                    <input id="prPosition" type="text">
                </div>
            </div>
            <!-- E-Mail преподавателя id=prMail -->
            <div class="rIItem">
                <span>
                    Адрес эл.почты
                </span>

                <div>
                    <input id="prMail" type="email">
                </div>
            </div>
            <!-- номер телефона преподавателя id=prPhone -->
            <div class="rIItem">
                <span>
                    Номер телефона
                </span>

                <div>
                    <input id="prPhone" type="number" placeholder="9998884433">
                </div>
            </div>
        </div>


        <div id="rCheckboxLabel">
            Буду участвовать в олимпиаде по ...
        </div>

        <div id="rCheckboxes">
            <div>
                <div class="rCheckbox" data-val="русский">
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

        <div id="rBtns">
            <div id="rBStart">
                Уже зарегистрирован
            </div>
            <div id="rBReg" >
                Зарегистрироваться
            </div>
        </div>

        <div id="support">
            По всем вопросам пишите на <a href="mailto:olimpiada.sgugit@yandex.ru">olimpiada.sgugit@yandex.ru</a>
        </div>
    </div>
</div>

<script src="/resources/js/languages/jquery-3.3.1.js"></script>
<script src="/resources/js/languages/main.js"></script>
</body>
</html>
