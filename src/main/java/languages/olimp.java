package languages;

import json.json;
import olimpBase.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URLEncoder;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class olimp {
    String lastErrorText = ""; //текст последней ошибки
    bd bd = null; //элемент для работы с БД

    public olimp () {

    }

    //отметить начало прохождения олимпиады по какому-то языку
    public Boolean setStart (HttpServletRequest request, HttpServletResponse response, token token) {
        try {
            if ( request == null || response == null ||  token == null ) {
                lastErrorText = "Переданы неверные параметры";

                return false;
            }

            String language = request.getParameter( "l" );
            Map< String, String > languages = new HashMap <String, String>(); //разрешённые языки и название соотвествующей таблицы

            languages.put( "английский", "english" );
            languages.put( "русский", "russian" );
            languages.put( "немецкий", "german" );

            //Если языка нет в списке, ошибка
            if ( language == null || language.equals( "" ) || !languages.containsKey( language ) ) {
                lastErrorText = "Для данного языка олимпиада не проходит";

                return false;
            }

            information info = new information( token );
            Object informationResult = info.getStartPageInfo( request );

            //Если ответ булевский, значи тошибка
            if ( informationResult instanceof Boolean ) {
                lastErrorText = info.getLastTextError();

                return false;
            }

            Map <String, String> infoData = (Map <String, String>) informationResult;

            //Если языка нет в результате
            if ( !infoData.containsKey( languages.get( language ) ) ) {
                lastErrorText = "Для переданного языка нет олимпиады ";

                return false;
            }

            //Если язык не выбран при регистрации, то возвращаем ошибку
            if ( infoData.get( languages.get( language ) ).equals( "off" ) ) {
                lastErrorText = "При регистрации вы не выбирали данный язык.\nОлимпиаду начать невохможно.";

                return false;
            }

            //Если олимпиада по языку уже закончена, то возвращаем ошибку
            if ( infoData.get( languages.get( language ) ).equals( "end" ) ) {
                lastErrorText = "Вы уже закончили олимпиаду по языку";

                return false;
            }

            if ( bd == null ) {
                bd = new bd( new olimpBase.information().getBDInfo() );
            }

            if ( !bd.connect() ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            int id = Integer.valueOf( infoData.get( "registerKey" ) );
            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM " + languages.get( language ) + " WHERE id = " + String.valueOf( id ) );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Ошибка во время запроса";

                return false;
            }

            //Если есть данные, значит олимпиаду уже проходил
            if ( sqlResult.getInt( "count" ) > 0 ) {
                lastErrorText = "Олимпиаду по данному языку вы уже проходили. Ожидайте результатов.";

                return false;
            }

            //Если не удалось сгенерировать токен для олимпиады
            if ( !token.createOlimpToken( languages.get( language ) ) ) {
                lastErrorText = token.getLastTextError();

                return false;
            }

            //Если не удалось записать токен для олимпиады
            if ( !token.writeOlimpTokenOnUser( id, null, languages.get( language ) ) ) {
                lastErrorText = token.getLastTextError() + " " + token.getToken();

                return false;
            }

            cookie cookie = new cookie(); //кука для записи токена олимпиады

            //Если не удалось записать токен олимпиады в куку
            if ( !cookie.writeCookie( "tok" + languages.get( language ), token.getToken(), "/", 65 * 60, response ) ) {
                lastErrorText = token.getLastTextError();

                return false;
            }

            bd.insertQuery( "INSERT INTO " + languages.get( language ) + "(id, answer_one, answer_two, answer_three, answer_other) VALUES(" + String.valueOf( id ) + ", '', '', '', '')" );
            sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM " + languages.get( language ) + " WHERE id = " + String.valueOf( id ) );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Ошибка выполнения запроса";

                return false;
            }

            //Если количество не равно 1, значит ошибка
            if ( sqlResult.getInt( "count" ) != 1 ) {
                lastErrorText = "Не удалось найти добавленную запись " + "INSERT INTO " + languages.get( language ) + "(id, answer_one, answer_two, answer_three, answer_other) VALUES(" + String.valueOf( id ) + ", '', '', '', '')";

                return false;
            }

            return true;
        }
        catch ( Exception err ) {
            StringWriter sw = new StringWriter( );
            PrintWriter pw = new PrintWriter( sw );

            err.printStackTrace( pw );

            try {lastErrorText = URLEncoder.encode(sw.toString(), "UTF-8");}catch (Exception error) {}

            return false;
        }
    }

    //Регистрация участника
    public Boolean register ( HttpServletRequest request, HttpServletResponse responce ) {
        json json = new json();
        try {
        token token = new token(request);

        //если токен валидный, значит это уже участник
        if (token.checkToken(null)) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "no"}}));

            return false;
        }
        // строки студента
        String name = request.getParameter("n");
        String secondName = request.getParameter("f");
        String threeName = request.getParameter("o");
        String town = request.getParameter("t");
        String university = request.getParameter("u");
        String specialty = request.getParameter("s");
        String institute = request.getParameter("i");
        String group = request.getParameter("g");
        String languagesStr = request.getParameter("l");
        String emailAddress = request.getParameter("m");
        String StuPhoneNumber = request.getParameter("p");
        String studentPassword = request.getParameter("ps");
        // строки преподавателя
        String prepName = request.getParameter("pFn");
        String prepLastName = request.getParameter("pLn");
        String prepPatronymic = request.getParameter("pPa");
        String prepPosition = request.getParameter("pPo");
        String prepEmailAddress = request.getParameter("pMa");
        String prepPhoneNumber = request.getParameter("pPh");


        if (name == null || secondName == null || threeName == null || town == null || university == null || specialty == null || institute == null || group == null || languagesStr == null) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Ошибка запроса"}}));

            return false;
        }

        String[] languages = languagesStr.split(",");
        bd bd = new bd(new olimpBase.information().getBDInfo());
        Map < String, String > languagesData = new HashMap<String, String>();

        languagesData.put( "русский", "russian" );
        languagesData.put( "английский", "english" );
        languagesData.put( "немецкий", "german" );

        StringBuilder columnNames = new StringBuilder( "" );
        StringBuilder columnValues = new StringBuilder( "" );

        for ( String language : languages ) {
            columnNames.append( "," ).append( languagesData.get( language ) );
            columnValues.append( "," ).append( "'true'" );
        }



            //если нет коннекта к бд
            if (!bd.connect()) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            Object sqlResultTmp = bd.query("SELECT COUNT(id) AS count FROM users WHERE LOWER(student_email) = LOWER('" + emailAddress + "')");

            //Если вернулся булевский тип, значит ошибка
            if (sqlResultTmp instanceof Boolean) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if (!sqlResult.next()) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Не удалось проверить. Попробуйте ещё раз."}}));

                return false;
            }

            //Если есть данные, значит уже регистрировался
            if (sqlResult.getInt("count") > 0) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "no"}}));

                return false;
            }

            if ( !bd.insertQuery( "INSERT INTO users(name, second_name, three_name, town, univer, specialty, institute, group_number, student_email, student_phone, teacher_name, teacher_second_name, teacher_three_name, teacher_position, teacher_email, teacher_phone, password" + columnNames.toString() + ") VALUES ('" + name + "', '" + secondName + "', '" + threeName + "', '" + town + "', '" + university + "', '" + specialty + "', '" + institute + "', '" + group + "','" + emailAddress + "','" + StuPhoneNumber + "','" + prepName + "','" + prepLastName + "','" + prepPatronymic + "','" + prepPosition + "','" + prepEmailAddress + "','" + prepPhoneNumber + "','" + studentPassword + "'" + columnValues.toString() + ");" ) ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            sqlResultTmp = bd.query("SELECT id FROM users WHERE LOWER(student_email) = LOWER('" + emailAddress + "')");

            //Если вернулся булевский тип, значит ошибка
            if (sqlResultTmp instanceof Boolean) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if (!sqlResult.next()) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Не удалось проверить регистрацию. Попробуйте ещё раз." + "INSERT INTO users(name, second_name, three_name, town, univer, specialty, institute, group_number" + columnNames.toString() + ") VALUES('" + name + "', '" + secondName + "', '" + threeName + "', '" + town + "', '" + university + "', '" + specialty + "', '" + institute + "', '" + group + "'" + columnValues.toString() + ")"}}));

                return false;
            }

            int id = sqlResult.getInt( "id" ); //ID участника

            if ( !token.createToken() ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Произошла ошибка: " + token.getLastTextError() + "\nВАШ РЕГИСТРАЦИОННЫЙ НОМЕР " + String.valueOf( id )}}));

                return false;
            }

            if ( !token.writeTokenOnUser( id, null ) ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Произошла ошибка: " + token.getLastTextError() + "\nВАШ РЕГИСТРАЦИОННЫЙ НОМЕР " + String.valueOf( id )}}));

                return false;
            }

            cookie cookie = new cookie(); //элемент для работы с куками


            confirmEmail email = new confirmEmail();
            //отправка письма с потдверждением mail
            if (!email.sendConfirmEmailToken(String.valueOf(id), studentPassword)){
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", email.getLastError()}}));

                return false;
            }

            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "ok"}, {"registrationKey", String.valueOf( id )}}));






            return true;
        }
        catch (Exception err) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", err.toString() + ". Попробуйте ещё раз."}}));

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    //Сохранение информации о студенте из ЛК в сессию
    public void userFromLK ( HttpServletRequest request, HttpServletResponse responce ) {
        try {
            json json = new json();
            String studentBook = request.getParameter("s");

            //если нет номера зачётки
            if (studentBook == null) {
                responce.getWriter().write( "Переданные параметры неверны" );
                responce.getWriter().close();

                return;
            }

            Map< String, Object > info = new olimpBase.information().getBDInfo();

            info.put( "bd", "students" );

            bd bd = new bd( info );

            //если нет коннекта к бд
            if (!bd.connect()) {
                responce.getWriter().write( "Ошибка: " + bd.getLastTextError() );
                responce.getWriter().close();

                return;
            }

            Object sqlResultTmp = bd.query("SELECT student, namespecialty, institute, grupa FROM students WHERE LOWER(studentbook) = LOWER('" + studentBook + "')");

            //Если вернулся булевский тип, значит ошибка
            if (sqlResultTmp instanceof Boolean) {
                responce.getWriter().write( "Ошибка: " + bd.getLastTextError() );
                responce.getWriter().close();

                return;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if (!sqlResult.next()) {
                responce.getWriter().write( "Не удалось получить информацию" );
                responce.getWriter().close();

                return;
            }

            String fio = sqlResult.getString( "student" );
            String spacialty = sqlResult.getString( "namespecialty" );
            String institute = sqlResult.getString( "institute" );
            String groupa = sqlResult.getString( "grupa" );
            HttpSession session = request.getSession();

            session.setAttribute( "name", fio.split(" ")[1] );
            session.setAttribute( "secondName", fio.split(" ")[0] );
            session.setAttribute( "threeName", fio.split(" ")[2] );
            session.setAttribute( "town", "Новосибирск" );
            session.setAttribute( "iniversity", "Сибирский государственный университет геосистем и технологий" );
            session.setAttribute( "spacialty", spacialty );
            session.setAttribute( "institute", institute );
            session.setAttribute( "groupa", groupa );
            session.setAttribute( "lkData", "ok" );

            request.getRequestDispatcher("/pages/languages/main.jsp").forward( request, responce );
        }
        catch (Exception err) {
            try{
                responce.getWriter().write(err.toString());
                }catch( Exception error ) {}
        }
        finally {
            if (bd != null) {
                bd.closeConnect();
            }
        }
    }

    //Запись ответов
    public Boolean writeAnswers ( HttpServletRequest request, HttpServletResponse responce, String language, token token, int maxParts ) {
        if (request == null || responce == null || language == null || token == null || maxParts <= 0) {
            lastErrorText = "Переданы неверные параметры";

            return false;
        }

        String results = request.getParameter("r");
        String partNumberStr = request.getParameter("p");
        String indicatorEndTimer = request.getParameter( "i" );
        json json = new json();


        if (results == null || results.length() <= 6 || partNumberStr == null) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errotText", "На сервер переданы неверные параметры. Попробуйте ещё раз."}}));

            return false;
        }

        results = results.replace("'", "\"");


        int part = Integer.valueOf(partNumberStr);
        String[] columnNames = {"answer_one", "answer_two", "answer_three"};
        bd bd = new bd( new olimpBase.information().getBDInfo() );

        try {
            Object idTMP = token.getIDByOlimpToken( null );

            if ( idTMP instanceof Boolean ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errotText", token.getLastTextError() + ". Попробуйте ещё раз."}}));

                return false;
            }

            int id = (Integer) idTMP;
            Object sqlResultTmp = bd.query("SELECT " + columnNames[ part - 1 ] + " FROM " + language + " WHERE id = " + String.valueOf( id ));

            //Если вернулся булевский тип, значит ошибка
            if (sqlResultTmp instanceof Boolean) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if (!sqlResult.next()) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Не удалось найти отметку о начале теста. Попробуйте ещё раз." + token.getToken() + " " + "SELECT " + columnNames[ part - 1 ] + " FROM " + language + " WHERE id = " + String.valueOf( id )}}));

                return false;
            }

            String answerInBD = sqlResult.getString( columnNames[ part - 1 ] );

            if ( answerInBD.length() > 6 ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "no"}, {"errorText", partNumberStr + " часть олимпиады вы уже выполняли."}}));

                return false;
            }

            bd.insertQuery( "UPDATE " + language + " SET " + columnNames[ part - 1 ] + " = '" + results + "' WHERE id = " + String.valueOf( id ) );
            sqlResultTmp = bd.query("SELECT COUNT(id) AS count FROM " + language + " WHERE id = " + String.valueOf( id ) + " AND " + columnNames[ part - 1 ] + " = '" + results + "'");

            //Если вернулся булевский тип, значит ошибка
            if (sqlResultTmp instanceof Boolean) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                return false;
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if (!sqlResult.next()) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Не удалось проверить результат добавления ответов. Попробуйте ещё раз."}}));

                return false;
            }

            if ( sqlResult.getInt( "count" ) != 1 ) {
                json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Не удалось добавить ответы. Попробуйте ещё раз."}}));

                return false;
            }

            //если последняя часть или есть индикатор завершения таймера на сайте
            if ( part == maxParts || indicatorEndTimer != null && indicatorEndTimer.equals( "e" ) ) {
                cookie cookie = new cookie();

                //*отпарвка сертификата*
                int userID = id;

                congratulations congratulations = new congratulations();

                if (!congratulations.sendCertificate(userID)){
                    System.out.println("сертификат на номер " + userID + " не отправлен! " + congratulations.getLastError());
                }

                cookie.writeCookie( "tok" + language, "", "/", -1, responce );
                bd.insertQuery( "UPDATE " + language + " SET end_time = NOW() WHERE id = " + String.valueOf( id ) );


            }




            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "ok"}}));

            return true;
        }
        catch (Exception err) {
            lastErrorText = err.toString();

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    //Закрыть коннект с бд
    public void closeConnect () {
        if ( bd != null ) {
            bd.closeConnect();
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
