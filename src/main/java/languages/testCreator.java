package languages;
import olimpBase.*;
import olimpBase.information;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

@WebServlet( name="testCreator", urlPatterns = {"/languages/testCreator", "/languages/testCreator/"})
public class testCreator extends HttpServlet{

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {

        try {
            request.getRequestDispatcher( "/pages/languages/testCreator.jsp" ).forward( request, responce );
        } catch (Exception err){

        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse responce) throws ServletException, IOException {
        responce.setCharacterEncoding("utf-8");
        responce.setContentType("text/html;charset=utf-8");


        Enumeration<String> testTemplate = request.getParameterNames();
        bd bd = null;
        String testName = request.getParameter(testTemplate.nextElement());
        int testTime = Integer.parseInt(request.getParameter(testTemplate.nextElement()));
        StringBuilder instruction = new StringBuilder("");
        System.out.println("Название тестирования: " + testName);
        System.out.println("Время тестирования: " + testTime );
        while (testTemplate.hasMoreElements()){
            String element = testTemplate.nextElement();
            instruction.append(element).append("=").append(request.getParameter(element)).append("&");
        }
        instruction.setLength(instruction.length() - 1);
        System.out.println("Инструкция: " + instruction);


        try{
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }

            bd.insertQuery( "INSERT INTO test_template(test_name, instruction, test_time) VALUES ('" + testName + "', '"+ instruction.toString() +"', "+testTime+")" );

        }
        catch ( Exception err ) {
            System.out.println("Что-то с запросом");
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

}
