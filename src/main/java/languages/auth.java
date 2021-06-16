package languages;

import json.json;
import olimpBase.bd;
import olimpBase.cookie;
import olimpBase.information;
import olimpBase.token;
import olimpBase.confirmEmail;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.ResultSet;

public class auth {
    private String lastErrorText = ""; //текст последней ошибки
    //HttpServletRequest request = null; //запрос

    public auth () {
    }

    //Провести авторизацию
    public Boolean doAuth ( HttpServletRequest req, HttpServletResponse resp ) {
        bd bd = null;
        token token = null;

        try {
            new cookie().writeCookie( "tok", "", "/", 15 * 24 * 60 * 60, resp ); //удаляем куку с токеном

            String key = req.getParameter( "k" ); //регистарционный ключ
            String studentPassword = req.getParameter("s"); //пароль участника

            //Если ключ не равен нужному, включать для теста с одного аккаунта
            /*if ( key != null && !key.equals( "9999" ) ) {
                lastErrorText = "Ошибка при доступе к олимпиаде";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "errorEnterData"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }*/

            if ( key == null || studentPassword == null ) {
                lastErrorText = "Один или несколько парамтеров отсутствуют";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "errorEnterData"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                lastErrorText = bd.getLastTextError();
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM users WHERE id = " + key + " AND password = '" + studentPassword + "'" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText}} ) );

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Проверьте корректность введённх данных";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            //Если количество не равно 1, значит токена нет или какой-то косяк
            if ( sqlResult.getInt( "count" ) != 1 ) {
                lastErrorText = "Участник с данными параметрами не найден";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Проверьте введённые данные и попробуйте ещё раз."}} ) );

                return false;
            }

            //Проверка на подтверждение токена из confirm_email
            sqlResultTmp = bd.query("SELECT is_active FROM confirm_email WHERE id_user = '" + key + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText}} ) );

                return false;
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            if ( !sqlResult.next() ) {
                lastErrorText = "Проверьте корректность введённх данных";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            if ( sqlResult.getInt( "is_active" ) != 1 ) {
                lastErrorText = "Почта участника не подтверждена";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Проверьте введённые данные и попробуйте ещё раз."}} ) );

                return false;
            }

            token = new token ( req );

            //если не удалось создать токен
            if ( !token.createToken() ) {
                lastErrorText = "Не удалось создать токен";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            //если не удалось записать токен на пользователя
            if ( !token.writeTokenOnUser ( Integer.valueOf(key), null ) ) {
                lastErrorText = token.getLastTextError();
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }

            cookie cookie = new cookie(); //элемент для работы с куками

            //если особый пользователь
            if ( key.equals( "9999" ) ) {
                cookie.writeCookie( "a", "9999", "/", 2 * 24 * 60, resp );
            }
            else {
                cookie.writeCookie( "a", "", "/", -1, resp );
            }

            //если не удалось записать куку с токеном
            if ( !cookie.writeCookie( "tok", token.getToken(), "/", 15 * 24 * 60 * 60, resp ) ) {
                lastErrorText = "Не удалось записать токен клиенту";
                new json().sendJSONstring( resp, new json().formatArray( new String[][] { {"status", "error"}, {"errorText", lastErrorText + ". Попробуйте ещё раз."}} ) );

                return false;
            }


            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
            if ( token != null ) {
                token.closeConnect();
            }
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
