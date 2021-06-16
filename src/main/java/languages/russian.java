package languages;

import json.json;
import olimpBase.cookie;
import olimpBase.times;
import olimpBase.token;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet( name = "languagesRussian", urlPatterns = {"/languages/russian", "/languages/russian/"} )
public class russian extends HttpServlet {
    String minDateTime = "19:00 11.11.2020", maxDateTime = "23:00 17.11.2020";
    times times = new times( minDateTime, maxDateTime );

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        token token = new token( request );
        json json = new json();

        //Если кука олимпиады невалидна или вышло время
        if ( /*(*/!token.checkOlimpToken( null, "tokrussian" )/* || !(new cookie().getCookie( "a", request )).equals( "9999" )) && (!token.checkOlimpToken( null, "tokrussian" ) || !times.checkCurrentTime())*/ ) {
            responce.sendRedirect( "/languages/start" );

            return;
        }

        request.getRequestDispatcher( "/pages/languages/russian.jsp" ).forward( request, responce );
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.setCharacterEncoding("utf-8");
        responce.setContentType("text/html;charset=utf-8");

        token token = new token( request );
        json json = new json();

        if ( !token.checkOlimpToken( null, "tokrussian" ) ) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errotText", "Токен истёк, результаты будут опубликованы позже."}}));

            return;
        }

        //если вышло время
        if ( !times.checkCurrentTime() && !(new cookie().getCookie( "a", request )).equals( "9999" ) ) {
            json.sendJSONstring(responce, json.formatArray(new String[][]{{"status", "error"}, {"errotText", "Олимпиада закончилась или время проведения олимпиады ещё не пришло."}}));

            return;
        }

        olimp olimp = new olimp( );

        olimp.writeAnswers( request, responce, "russian", token, 2 ); //передаём запись результатов соответствующй фукнции
    }
}
