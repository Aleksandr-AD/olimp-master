package languages;

import json.json;
import olimpBase.token;
import olimpBase.bd;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet(name = "languagesMain", urlPatterns = {"/languages", "/languages/"} )
public class languages extends HttpServlet {

    @Override
    protected void doGet (HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
       request.getRequestDispatcher("/pages/languages/main.jsp").forward( request, responce );
    }

    @Override
    protected void doPost (HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.setCharacterEncoding("utf-8");
        responce.setContentType("text/html;charset=utf-8");

        olimp olimp = new olimp();

        //Если переход с ЛК
        if ( request.getParameter( "f" ) != null ) {

            olimp.register(request, responce); //передаём все данные в фукнцию регистрации нового участника
        }
    }
}
