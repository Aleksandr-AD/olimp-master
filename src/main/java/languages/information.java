package languages;

import com.sun.org.apache.xpath.internal.operations.Bool;
import olimpBase.token;
import olimpBase.bd;

import javax.servlet.http.HttpServletRequest;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class information {
    String lastErrorText = ""; //текст последней ошибки
    token token = null; //элемент для работы с токенами
    bd bd = null;

    public information ( token setToken ) {
        token = setToken;
    }

    //Получение инормации для страницы start (ID, данные по участию в олимпиадах)
    public Object getStartPageInfo ( HttpServletRequest request ) {
        try {
            if ( request == null ) {
                lastErrorText = "Переданы неверные данные";

                return false;
            }

            int resultGetID = token.getIDByToken( null ); //получение ID по токену

            //Если ошибка
            if ( resultGetID == -1 ) {
                lastErrorText = token.getLastTextError();

                return false;
            }

            //Если нет такого токена
            if ( resultGetID == 0 ) {
                lastErrorText = "Токен не зарегистрирован";

                return false;
            }

            int id = (int) resultGetID;

            bd = new bd( new olimpBase.information().getBDInfo() );

            if ( !bd.connect() ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT english, russian, german FROM users WHERE id = " + String.valueOf(id) );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит нет такого токена
            if ( !sqlResult.next() ) {
                lastErrorText = "Ошибка запроса";

                return false;
            }

            //Выбранные пользователем языки при регистрации
            Boolean [] selectLanguages = { sqlResult.getBoolean( "english" ) , sqlResult.getBoolean( "russian" ) , sqlResult.getBoolean( "german" ) };
            String [] languages = {"english", "russian", "german"}; //названия таблиц для языков
            Map <String, String> result = new HashMap<String, String>();

            result.put( "status", "ok" );
            result.put( "registerKey", String.valueOf(id) );

            for ( int i = 0; i <= selectLanguages.length - 1; i++ ) {
                //Если язык не был выбран
                if ( !selectLanguages[ i ] ) {
                    result.put(languages[i], "off"); //записываем статус

                    continue;
                }

                sqlResultTmp = bd.query("SELECT COUNT(id) AS count FROM " + languages[i] + " WHERE id = " + String.valueOf(id) );

                //Если вернулся булевский тип, значит ошибка
                if (sqlResultTmp instanceof Boolean) {
                    lastErrorText = bd.getLastTextError();

                    return false;
                }

                sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
                sqlResultTmp = null;

                //если нет первого элемента, значит ошибка
                if (!sqlResult.next()) {
                    lastErrorText = "Ошибка запроса данных";

                    return false;
                }

                //Если число равно 1, значит олимпиада была уже выполнена
                if (sqlResult.getInt("count") == 1) {
                    result.put(languages[i], "end"); //записываем статус

                    continue;
                }

                //Если число равно 0, значит олимпиада не была выполнена
                if (sqlResult.getInt("count") == 0) {
                    result.put(languages[i], "on"); //записываем статус
                }
            }

            return result;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
        finally {
            if ( token != null ) {
                token.closeConnect();
            }
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
