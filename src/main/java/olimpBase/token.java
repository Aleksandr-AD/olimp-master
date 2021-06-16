package olimpBase;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.sql.ResultSet;
import java.util.Random;

public class token {
    String lastErrorText = ""; //текст последней ошибки
    HttpServletRequest request = null; //запрос с данными
    String token = null; //токен
    bd bd = null; //элемент для работы с БД
    int tokenLength = 20; //длина токена

    public token ( HttpServletRequest requestSet ) {
        if ( requestSet == null ) {
            return;
        }

        bd = new bd(new information().getBDInfo());

        if ( !bd.connect() ) {
            lastErrorText = bd.getLastTextError();

            return;
        }

        request = requestSet;
        Object tokenTmp = getCookieToken( request ); //токен в куках

        //если нет токена в куках, то есть тип Boolean вернулся
        if ( tokenTmp instanceof Boolean ) {
            return;
        }

        token = (String) tokenTmp; //берём токен
    }

    //Создать токен
    public Boolean createToken ( ) {
        try {
            String tokenGen;
            String availableChar = "qwQerWtEyuRiToYpaU!sIdfOg=PhAjk9S8l.D7zFxGcHv_JbKnLmZ0X1C2V3B-4N5M6";
            int errorCount = 0; //количество ошибок во время генерации

            do {

                tokenGen = "";

                for ( int i = 1; i <= tokenLength; i++ ) {
                    tokenGen = new StringBuilder(tokenGen).append( availableChar.charAt( new Random().nextInt(availableChar.length() - 1)) ).toString();
                }

                errorCount++;

            }
            while ( !isUniqToken( tokenGen ) && errorCount <= 3 );

            //Если ошибки достигли максиума
            if ( errorCount == 3 ) {
                lastErrorText = "Не удалось сгенерировать токен";

                return false;
            }

            token = tokenGen;

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Проверить токен на уникальность
    private Boolean isUniqToken ( String checkToken ) {
        try {
            if ( bd == null ) {
                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token WHERE token = '" + checkToken + "'" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                return false;
            }

            //Если количество равно 0, значит токена нет, он уникален
            if ( sqlResult.getInt( "count" ) == 0 ) {
                return true;
            }

            return false;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Записать токен на пользователя
    public Boolean writeTokenOnUser ( int id, String newWriteToken ) {
        try {
            if ( bd == null ) {
                lastErrorText = "Не связи с БД";

                return false;
            }

            String writeToken = newWriteToken == null ? token : newWriteToken;
            bd.deleteQuery( "DELETE FROM token WHERE id = " + String.valueOf( id ) ); //удаляем все предыдущие токены
            bd.insertQuery( "INSERT INTO token (id, token) VALUES (" + id + ", '" + writeToken + "')" ); //вставили новый токен

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token WHERE token = '" + writeToken + "'" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Не удалось выполнить запрос";

                return false;
            }

            //Если количество равно 0, значит токена нет, он не записался
            if ( sqlResult.getInt( "count" ) == 0 ) {
                lastErrorText = "Не удалось найти добавленный токен";

                return false;
            }

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }

    //Создать токен для участия в олимпиаде
    public Boolean createOlimpToken ( String lang ) {
        try {
            String tokenGen;
            String availableChar = "qwQerWtEyuRiToYpaU!sIdfOg=PhAjk9S8l.D7zFxGcHv_JbKnLmZ0X1C2V3B-4N5M6";
            int errorCount = 0; //количество ошибок во время генерации

            do {

                tokenGen = "";

                for ( int i = 1; i <= tokenLength; i++ ) {
                    tokenGen = new StringBuilder(tokenGen).append( availableChar.charAt( new Random().nextInt(availableChar.length() - 1)) ).toString();
                }

                errorCount++;

            }
            while ( !isUniqOlimpToken( tokenGen, lang ) && errorCount <= 3 );

            //Если ошибки достигли максиума
            if ( errorCount == 3 ) {
                lastErrorText = "Не удалось сгенерировать токен";

                return false;
            }

            token = tokenGen;

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Проверить токен участия олимпиады на уникальность
    private Boolean isUniqOlimpToken ( String checkToken, String lang ) {
        try {
            if ( bd == null ) {
                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token_dop WHERE token = '" + checkToken + "' AND lang = '" + lang + "'" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                return false;
            }

            //Если количество равно 0, значит токена нет, он уникален
            if ( sqlResult.getInt( "count" ) == 0 ) {
                return true;
            }

            return false;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }
    //Записать токен участия олимпиады на пользователя
    public Boolean writeOlimpTokenOnUser ( int id, String newWriteToken, String lang ) {
        try {
            if ( bd == null ) {
                lastErrorText = "Не связи с БД";

                return false;
            }

            String writeToken = newWriteToken == null ? token : newWriteToken;

            bd.deleteQuery( "DELETE FROM token_dop WHERE id = " + String.valueOf( id ) + " AND lang = ' " + lang + " '" ); //удаляем все предыдущие токены
            bd.insertQuery( "INSERT INTO token_dop (id, token, lang) VALUES (" + id + ", '" + writeToken + "', '" + lang + "')" ); //вставили новый токен

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token_dop WHERE token = '" + writeToken + "' AND lang = '" + lang + "'" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError() + "44";

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Не удалось выполнить запрос";

                return false;
            }

            //Если количество равно 0, значит токена нет, он не записался
            if ( sqlResult.getInt( "count" ) == 0 ) {
                lastErrorText = "Не удалось найти добавленный токен";

                return false;
            }

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }

    //Получить токен
    public String getToken () {
        return token;
    }
    //Получить id по токену
    public Integer getIDByToken ( String searchToken ) {
        try {
            if ( bd == null ) {
                lastErrorText = "Не связи с БД";

                return -1;
            }

            String realToken = searchToken == null ? token : searchToken;
            Object sqlResultTmp = bd.query( "SELECT id FROM token WHERE token = '" + realToken + "' AND extract(days from NOW() - time) <= 15" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                return -1;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит нет такого токена
            if ( !sqlResult.next() ) {
                return 0;
            }

            return sqlResult.getInt( "id" );
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return -1;
        }
    }
    //Получить id по токену участника олимпиады
    public Integer getIDByOlimpToken ( String searchToken ) {
        try {
            if ( bd == null ) {
                lastErrorText = "Не связи с БД";

                return -1;
            }

            String realToken = searchToken == null ? token : searchToken;
            Object sqlResultTmp = bd.query( "SELECT id FROM token_dop WHERE token = '" + realToken + "' AND extract(minutes from NOW() - time) <= 65" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                return -1;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит нет такого токена
            if ( !sqlResult.next() ) {
                return 0;
            }

            return sqlResult.getInt( "id" );
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return -1;
        }
    }
    //Установить токен
    public void setToken ( String newToken ) {
        token = newToken;
    }

    //Закрыть коннект с бд
    public void closeConnect () {
        if ( bd != null ) {
            bd.closeConnect();;
        }
    }

    //Проверить токен на валидность
    public Boolean checkToken ( String tokenToCheck ) {
        try {
            if ( tokenToCheck == null && token == null ) {
                lastErrorText = "Не передан токен";

                return false;
            }

            String tokenCheck = tokenToCheck == null ? token : tokenToCheck;

            if ( bd == null ) {
                lastErrorText = "Не связи с БД";

                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token WHERE token = '" + tokenCheck + "' AND extract(days from NOW() - time) <= 15" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Токен истёк";

                return false;
            }

            //Если количество не равно 1, значит токена нет или какой-то косяк
            if ( sqlResult.getInt( "count" ) != 1 ) {
                lastErrorText = "Токен истёк или испорчен";

                return false;
            }

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Проверить токена участия олимпиады на валидность
    public Boolean checkOlimpToken ( String tokenToCheck, String name ) {
        try {
            if ( tokenToCheck == null && token == null ) {
                lastErrorText = "Не передан токен";

                return false;
            }

            String tokenCheck = null;

            if ( name != null ) {
                Object tokenTmp = getCookieOlimpToken( request, name ); //токен в куках

                //если нет токена в куках, то есть тип Boolean вернулся
                if ( tokenTmp instanceof Boolean ) {
                    lastErrorText = "Нет токена олимпиады";

                    return false;
                }

                token = (String) tokenTmp; //берём токен
                tokenCheck = token;
            }
            else {
                tokenCheck = tokenToCheck == null ? token : tokenToCheck;
            }

            if ( bd == null ) {
                lastErrorText = "Нет связи с БД";

                return false;
            }

            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM token_dop WHERE token = '" + tokenCheck + "' AND extract(minutes from NOW() - time) <= 65" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                lastErrorText = bd.getLastTextError();

                return false;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса
            sqlResultTmp = null;

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                lastErrorText = "Токен истёк";

                return false;
            }

            //Если количество не равно 1, значит токена нет или какой-то косяк
            if ( sqlResult.getInt( "count" ) != 1 ) {
                lastErrorText = "Токен истёк или испорчен";

                return false;
            }

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }

    //Получить токен из куков
    private Object getCookieToken( HttpServletRequest request ) {
        try {
            cookie cookie = new cookie(); //элемент для работы с куками
            Object getResult = cookie.getCookie( "tok", request ); //результат получения куки

            //Если нет куки с токеном
            if ( getResult == null || getResult instanceof String && getResult.toString().length() != tokenLength ) {
                return false;
            }

            return getResult.toString();
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Получить токен участия в олимпиаде из куков
    private Object getCookieOlimpToken( HttpServletRequest request, String name ) {
        try {
            cookie cookie = new cookie(); //элемент для работы с куками
            Object getResult = cookie.getCookie( name, request ); //результат получения куки

            //Если нет куки с токеном
            if ( getResult == null || getResult instanceof String && getResult.toString().length() != tokenLength ) {
                return false;
            }

            return getResult.toString();
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
