package olimpBase;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.ResultSet;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

@WebServlet( name="confirmEmailPage", urlPatterns = {"/confirm_email/page", "/confirm_email/page/"})
public class confirmEmailPage extends HttpServlet {
    private String lastError = "";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.setCharacterEncoding("utf-8");
        responce.setContentType("text/html;charset=utf-8");

        bd bd = null;

        try {
            //Токен из кук
            String token = request.getParameter( "t" );

            //Если нет токена
            if ( token == null || token.length() < 5 ) {
                throw new Exception( "Неверный токен" );
            }

            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }

            //ищем неактивированные записи с токеном
            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM confirm_email WHERE token = '" + token + "' AND is_active = 0" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске токена: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            //Если количество не равно 1, значит токена нет (почта либо активирована, либо токен неверный)
            if ( sqlResult.getInt( "count" ) != 1 ) {
                throw new Exception( "Токен не найден или почта уже подтверждена" );
            }

            //Обновляем статус подтверждения почты
            bd.query( "UPDATE confirm_email SET is_active = 1 WHERE token = '" + token + "' AND is_active = 0" );

            //ищем неактивированные записи с токеном
            sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM confirm_email WHERE token = '" + token + "' AND is_active = 1" );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске подтверждённого токена: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд при поиске токена" );
            }

            //Если количество не равно 1, значит токена нет (почта либо активирована, либо токен неверный)
            if ( sqlResult.getInt( "count" ) != 1 ) {
                throw new Exception( "Не удаось подтвердить почту" );
            }

            //отправляем успешный ответ
            responce.getWriter().write( "<div><span>Почта успешно подтверждена</span></div>" +
                    "<div><a href=\"/languages/start\" target=\"_parent\">На страницу авторизации/регистрации</a></div>" );
        }
        catch ( Exception err ) {
            responce.getWriter().write( err.getMessage() );
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.getWriter().write( "Неверный запрос" );
    }

    public String getLastError() {
        return lastError;
    }
}
