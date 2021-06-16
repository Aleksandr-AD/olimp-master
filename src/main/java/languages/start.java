package languages;

import olimpBase.*;
import json.json;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.GregorianCalendar;
import java.util.Map;

@WebServlet( name="languagesStart", urlPatterns = {"/languages/start", "/languages/start/"})
public class start extends HttpServlet {
    HttpSession session = null; //сессия
    String minDateTime = "19:00 11.11.2020", maxDateTime = "23:00 17.11.2021";
    olimpBase.times times = new times( minDateTime, maxDateTime );

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        session = request.getSession();

        token token = new token ( request );

        try {
            //если есть токен, то показываем страницу с выбором языка
            if ( token.checkToken( null ) && times.checkCurrentTime() || token.checkToken( null ) && (new cookie().getCookie( "a", request )).equals( "9999" ) ) {
                request.getRequestDispatcher( "/pages/languages/start.jsp" ).forward( request, response );

                return;
            }

            //иначе переход на страницу авториазации
            request.getRequestDispatcher( "/pages/languages/startAuth.jsp" ).forward( request, response );
        }
        finally {
            token.closeConnect();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");

        String type = request.getParameter("t"); //тип запроса
        json json = new json();

        //Если время не пришло
        if ( !times.checkCurrentTime() && type.equals( "auth" ) && !request.getParameter( "k" ).equals( "9999" ) ) {
            json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Олимпиада закончилась или время проведения олимпиады ещё не пришло. №2"}}));

            return;
        }

        //Если нет типа запроса
        if (type == null) {
            json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", "Ошибка запроса"}}));

            return;
        }

        //Если авторизация
        if (type.equals("auth")) {
            auth auth = new auth();

            //Если не удалось авторизоваться
            if (!auth.doAuth(request, response)) {
                json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", auth.getLastTextError()}}));
            }
            //если удалось
            else {
                json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "ok"}}));
            }
        }
        //Если получение инфомрации
        else if (type.equals("info")) {
            token token = new token(request);
            information info = null;

            try {
                //Если токен невалидный
                if ( !token.checkToken( null ) ) {
                    response.sendRedirect( "/languages/start" ); //перенаправляем запрос на страницу авториазции

                    return;
                }

                info = new information( token );

                Object result = info.getStartPageInfo( request );

                //Если булевский тип, значит ошибка
                if ( result instanceof Boolean ) {
                    json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", info.getLastTextError()}}));

                    return;
                }

                Map< String, String > infoData = (Map< String, String >) result; //полученная информация

                json.sendJSONstring( response, json.formatMapFirstLvL( infoData ) );
            }
            finally {
                token.closeConnect();
            }
        }
        //Если отметить начало олимпиады
        else if ( type.equals( "start" ) ) {
            token token = new token(request);

            olimp olimp = new olimp(); //экземпляр для работы с олимпиадами по языкам


            try {
                //Если токен невалидный
                if ( !token.checkToken( null ) ) {
                    response.sendRedirect( "/languages/start" ); //перенаправляем запрос на страницу авториазции

                    return;
                }

                //Если не удалось зарегистрировать начало олимпиады
                if (!olimp.setStart( request, response, token )) {
                    json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", olimp.getLastTextError()}}));
                }
                //если удалось
                else {
                    GregorianCalendar nowDate = new GregorianCalendar(); //текущая дата
                    GregorianCalendar minDate = new GregorianCalendar();
                    GregorianCalendar maxDate = new GregorianCalendar();
                    minDate.setTimeInMillis( new SimpleDateFormat( "HH:mm dd.MM.yyyy" ).parse( minDateTime ).getTime() );
                    maxDate.setTimeInMillis( new SimpleDateFormat( "HH:mm dd.MM.yyyy" ).parse( maxDateTime ).getTime() );
                    String time = "90"; //время на прохождение

                    //Если разница между датой окончания и текущей датой меньше 90 минут
                    if ( ( maxDate.getTimeInMillis() - nowDate.getTimeInMillis() ) / 1000 / 60 < 90 ) {
                        time = String.valueOf( ( maxDate.getTimeInMillis() - nowDate.getTimeInMillis() ) / 1000 / 60 );
                    }

                    request.getSession( true ).setAttribute( "time", time );
                    json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "ok"}}));
                }
            }
            catch ( Exception err ) {
                json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", err.toString()}}));
            }
            finally {
                olimp.closeConnect();
                token.closeConnect();
            }
        }

        else if (type.equals("instruction")){
                token token = new token(request);
                bd bd = new bd(new olimpBase.information().getBDInfo());
                //если нет коннекта к бд
                if (!bd.connect()) {
                    json.sendJSONstring(response, json.formatArray(new String[][]{{"status", "error"}, {"errorText", bd.getLastTextError()}}));

                    return;
                }

                String id = Integer.toString(token.getIDByToken(token.getToken()));

                bd.query( "UPDATE users SET instruction_active = 1 WHERE id = '" + id + "' AND instruction_active = 0" );
                bd.closeConnect();


        }

    }
}
