package languages;

import json.json;
import olimpBase.bd;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet( name="testTesting", urlPatterns = {"/languages/testTesting", "/languages/testTesting/"})
public class testTesting extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        try {
            request.getRequestDispatcher( "/pages/languages/testTesting.jsp" ).forward( request, responce );
        } catch (Exception err){

        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.setCharacterEncoding("utf-8");
        responce.setContentType("text/html;charset=utf-8");

        String command = request.getParameter("command");
        bd bd = null;

        if (command == null) {
            System.out.println("нет команды");
            return;
        }

        if (command.equals("loadOlimpInfo")){
            try {
                String olimpId = request.getParameter("olimpId");
                bd = new bd(new olimpBase.information().getBDInfo());

                Object sqlResultTmp = bd.query("SELECT test_name FROM test_template WHERE id = '" + olimpId + "'");

                if (sqlResultTmp instanceof Boolean) {
                    System.out.println("Запрос не получен");
                    return;
                }

                ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

                if (!sqlResult.next()){
                    System.out.println("В запросе пусто");
                    return;
                }

                String testName = "testName=" + sqlResult.getString("test_name");
                responce.getWriter().write(testName);

                sqlResultTmp = bd.query("SELECT test_time FROM test_template WHERE id = '" + olimpId + "'");
                if (sqlResultTmp instanceof Boolean) {
                    System.out.println("Запрос не получен");
                    return;
                }
                 sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

                if (!sqlResult.next()){
                    System.out.println("В запросе пусто");
                    return;
                }

                String testTime = "&testTime=" + sqlResult.getString("test_time");
                responce.getWriter().write(testTime);

                responce.getWriter().close();

            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            finally {
                if ( bd != null ) {
                    bd.closeConnect();
                }
            }
        }

        if (command.equals("loadOlimpParts")){
            try {
            String testId = request.getParameter("olimpId");
            bd = new bd(new olimpBase.information().getBDInfo());

            Object sqlResultTmp = bd.query("SELECT instruction FROM test_template WHERE id = '" + testId + "'");

            if (sqlResultTmp instanceof Boolean) {
                System.out.println("Запрос не получен");
                return;
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            if (!sqlResult.next()){
                System.out.println("В запросе пусто");
                return;
            }

            String instruction = sqlResult.getString("instruction");
            responce.getWriter().write(instruction);
            responce.getWriter().close();

            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            finally {
                if ( bd != null ) {
                    bd.closeConnect();
                }
            }
        }

        if (command.equals("savePart")){
            try {
                String part = request.getParameter("part");
                String userId = request.getParameter("userId");
                String testId = request.getParameter("testId");
                String answers = request.getParameter("answers");
                System.out.println("part=" + part + " userId=" + userId + " testId=" + testId + " answers=" + answers);

                bd = new bd(new olimpBase.information().getBDInfo());
                if (Integer.parseInt(part) == 1){
                    bd.query("UPDATE test_user SET test_id = "+testId+" WHERE id = "+userId+"");
                }

                bd.query("UPDATE test_user SET answers = concat(answers, 'Part"+part+"="+answers+" ') WHERE id = "+userId+"");
            } catch (Exception e){
                System.out.println(e.toString());;
            }
            finally {
                if ( bd != null ) {
                    bd.closeConnect();
                }
            }
        }
    }
}
