package olimpBase;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class cookie {
    private String lastErrorText = ""; //текст последней ошибки

    public cookie () {

    }

    //Записать куки
    public Boolean writeCookie (  String name, String value, String path, int time, HttpServletResponse responce ) {
        try {
            if ( name == null || responce == null ) {
                lastErrorText = "Переданы неверные параметры";

                return false;
            }

            Cookie cook = new Cookie( name, value == null ? "" : value ); //создаём куку

            cook.setPath( path == null ? "/" : path ); //устаанвливаем путь в домене
            cook.setMaxAge( time ); //время жизни ставим
            responce.addCookie( cook ); //добавляем куку в ответ сервера

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }

    //Получить куку
    public String getCookie (  String name, HttpServletRequest request ) {
        try {
            if ( name == null || request == null ) {
                lastErrorText = "Переданы неверные параметры";

                return null;
            }

            String str = "";
            Cookie[] cookies = request.getCookies();

            if ( cookies != null && cookies.length >= 1 ) {

                for (int i = 0; i <= cookies.length - 1; i++) {

                    if ( cookies[i] != null  && cookies[i].getName().equals( name ) ) {
                        str = cookies[i].getValue();

                        break;
                    }

                }

            }
            else {
                return null;
            }

            return str;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return null;
        }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
