package json;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class json {
    String lastErrorText = ""; //текст последней ошибки

    public json () {

    }

    //Форматирование массива в json строку
    public String formatArray ( Object [][] array ) {
        try {
            StringBuilder jsonStr = new StringBuilder( "{" );

            for ( Object[] item : array ) {
                jsonStr.append( "\"" ).append( item[ 0 ].toString() ).append( "\" : \"" ).append( item[ 1 ].toString().replaceAll( "\"", "'" ) ).append( "\"," );
            }

            jsonStr.deleteCharAt( jsonStr.length() - 1 ).append( "}" );

            return jsonStr.toString();
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return "false";
        }
    }
    //Форматирование словаря 1-го уровня в json строку
    public String formatMapFirstLvL(Map <String, String> map) {
        try {
            StringBuilder jsonStr = new StringBuilder( "{" );

            for ( Map.Entry <String, String> item : map.entrySet() ) {
                jsonStr.append( "\"" ).append( item.getKey() ).append( "\" : \"" ).append( item.getValue().replaceAll( "\"", "'" ) ).append( "\"," );
            }

            jsonStr.deleteCharAt( jsonStr.length() - 1 ).append( "}" );

            return jsonStr.toString();
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return "false";
        }
    }

    //Отправить json строку
    public void sendJSONstring ( HttpServletResponse responce, String str ) {
        try {
            if ( str == null ) {
                return;
            }

            responce.getWriter().write( str );
            responce.getWriter().close();
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return;
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
