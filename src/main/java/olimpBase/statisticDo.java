package olimpBase;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet( name = "statisticDo", urlPatterns = { "/statistic-do", "/statistic-do/" })
public class statisticDo extends HttpServlet {
    String lastErrorText = ""; //текст последней ошибки
    bd bd = null; //элемент для работы с БД
    Map < String, Map < String, String > > langData = new HashMap<String, Map<String, String>>(); //данные по языкам для выборки

    @Override
    public void init() throws ServletException {
        super.init();

        Map < String, String > langEng = new HashMap<String, String>(); //данные по английскому
        langEng.put( "table", "english" ); //название таблицы
        langEng.put( "select", "$1.answer_one AS answer_one, $1.answer_two AS answer_two, $1.answer_three AS answer_three" ); //данные для блока SELECT в запросе
        langEng.put( "where", "$1.id" ); //данные для блока WHERE в запросе
        langEng.put( "maxParts", "3" ); //количество частей
        langEng.put( "answer_one_type", "test" ); //тип первой части test - обычный тест или аудирование с тестом после
        langEng.put( "answer_one", "2|1|3|2|3|1|1|3|2|2" ); //ответы на первую часть (название ключа должно совпадать с названием столбца в выборке)
        langEng.put( "answer_two_type", "test" ); //тип второй части test - обычный тест или аудирование с тестом после
        langEng.put( "answer_two", "1|2|3|1|3|1|2|3|2|2" ); //ответы на вторую часть (название ключа должно совпадать с названием столбца в выборке)

        langData.put( "langEng", langEng ); //вставляем данные для английского

        Map < String, String > langRus = new HashMap<String, String>(); //данные по русскому
        langRus.put( "table", "russian" ); //название таблицы
        langRus.put( "select", "$1.answer_one AS answer_one, regexp_replace($1.answer_two, E'[\\r\\n]+', '', 'g') AS answer_two, $1.answer_three AS answer_three" ); //данные для блока SELECT в запросе
        langRus.put( "where", "$1.id" ); //данные для блока WHERE в запросе
        langRus.put( "maxParts", "3" ); //количество частей
        langRus.put( "answer_one_type", "test" );
        langRus.put( "answer_one", "3|3|1|3|3|2|3|3|3|3" ); //ответы на первую часть (название ключа должно совпадать с названием столбца в выборке)

        langData.put( "langRus", langRus ); //вставляем данные для русского

        Map < String, String > langGer = new HashMap<String, String>(); //данные по немецкому
        langGer.put( "table", "german" ); //название таблицы
        langGer.put( "select", "$1.answer_one AS answer_one, $1.answer_two AS answer_two, $1.answer_three AS answer_three" ); //данные для блока SELECT в запросе
        langGer.put( "where", "$1.id" ); //данные для блока WHERE в запросе
        langGer.put( "maxParts", "3" ); //количество частей
        langGer.put( "answer_one_type", "test" ); //тип первой части test - обычный тест или аудирование с тестом после
        langGer.put( "answer_one", "2|16|1|8|5|6|13|4|9|10|11|18|7|19|15|2|17|12|14|20" ); //ответы на первую часть (название ключа должно совпадать с названием столбца в выборке)
        langGer.put( "answer_two_type", "test" ); //тип второй части test - обычный тест или аудирование с тестом после
        langGer.put( "answer_two", "2|1|2|1|1|1|1|1|2|1" ); //ответы на вторую часть (название ключа должно совпадать с названием столбца в выборке)

        langData.put( "langGer", langGer ); //вставляем данные для немецкого
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding( "UTF-8" );
        resp.setCharacterEncoding( "UTF-8" );
        resp.setContentType( "text/html; charset=utf-8" );

        String key = req.getParameter( "k" ); //секретный ключ

        //Если ключ неверный
        if ( key == null || ! key.equals( "19GaZvPoL95" ) ) {
            writepage( "неверные параметры 1", resp );

            return;
        }

        String command = req.getParameter( "command" ); //комманда

        //Если команда невелидна или нет такой команды
        if ( command == null || ( !command.equals( "langAll" ) && !command.equals( "langEng" ) && !command.equals( "langGer" ) && !command.equals( "langRus" ) ) ) {
            writepage( "неверные параметры 2", resp );

            return;
        }

        String email = req.getParameter( "email" ) == null ? "dichkovsky_aleksandr@mail.ru" : req.getParameter( "email" ); //mail, на который сделать отправку

        //Если выгрузка статистики по языкам
        if (command.matches("lang[a-zA-Z]+")) {
            doLanguagesStatistic(command, email, resp); //делаем статистику по языкам

            return; //выходим
        }
    }

    //создание статистики по языкам
    private void doLanguagesStatistic ( String type, String email, HttpServletResponse resp ) throws IOException {
        ResultSet sql = null; //результат запроса
        File olimpStatisticFile = null; //файл с данными статистики
        FileWriter olimpStatisticFileWriter = null; //элемент для записи в файл
        String outputText = "Составление статистики по языкам<br/>"; //текст для вывода на страницу

        try {
            bd bd = new bd(new olimpBase.information().getBDInfo()); //создаём коннект к бд

            if ( !bd.connect() ) {
                writepage( "нет коннекта к бд", resp );

                return;
            }

            olimpStatisticFile = new File( "/olimp_statistic.csv" ); //файл с данными статистики

            //Если файла нет и не удалось создать
            if ( !olimpStatisticFile.exists() && !olimpStatisticFile.createNewFile() ) {
                writepage( "ошибка создания файла", resp );

                return;
            }

            olimpStatisticFileWriter = new FileWriter( olimpStatisticFile ); //элемент для записи в файл
            String delimiter = ";", newLine = "\r\n";
            String statisticStr = ""; //трока со статистикой
            boolean isDoCommand = false; //команда выполнялась

            //Если это все языки
            if ( type.equals( "langAll" ) ) {
                isDoCommand = true;
                outputText += "Выгрузка статистики по всем языкам<br/>";

                //Перебираем ключи словаря с данными по языкам
                for ( Map.Entry < String, Map <String, String> > lang : langData.entrySet() ) {
                    Map < String, String > data = lang.getValue(); //словарь с данными по языку
                    statisticStr += data.get( "table" ) + newLine;

                    outputText += "Запрос таблицы " + data.get( "table" ) + "<br />";
                    Object result = bd.query( "SELECT users.id, users.name, users.second_name, users.three_name, users.institute, " + data.get( "select" ).replaceAll( "\\$1", data.get( "table" ) ) + " FROM users, " + data.get( "table" ) + " WHERE users.id = " + data.get( "where" ).replaceAll( "\\$1", data.get( "table" ) ) + " ORDER BY users.id" ); //берём результат выполнения запроса

                    //если ошибка
                    if ( result instanceof Boolean && !(Boolean) result ) {
                        statisticStr += "Ошибка при получении данных" + newLine;
                        writepage( "ошибка запроса 1", resp );

                        return;
                    }

                    sql = (ResultSet) result; //преобразуем результат запроса в набор результатов

                    //если нет строк
                    if ( !sql.next() ) {
                        statisticStr += "По данному языку нет участников" + newLine;
                        outputText += "По языку " + data.get( "table" ) + " нет участников<br/>";

                        continue; //идём дальше
                    }

                    statisticStr += "Регистрационный номер" + delimiter + "Фамилия" + delimiter + "Имя" + delimiter + "Отчество" + delimiter + "Институт" + delimiter + "Ответы на 1-ую часть" + delimiter + "Результат 1-ой части";
                    statisticStr += delimiter + "Ответы на 2-ую часть" + delimiter + "Результат 2-ой части" + delimiter + "Ответы на 3-ю часть" + newLine;

                    //Перебираем выборку
                    while ( sql.next() ) {
                        String row = sql.getString( "id" ) + delimiter + sql.getString( "name" ) + delimiter + sql.getString( "second_name" ) + delimiter + sql.getString( "three_name" ) +
                                delimiter + sql.getString( "institute" ) + delimiter; //строка с данными ко участнику и результатам
                        row += sql.getString( "answer_one" ); //добавляем ответы на первую часть

                        //Если у олимпиады максимальное количество частей больше или равно 1-ой части, в ответах есть первая часть и в базе у участника есть ответы на первую часть
                        if ( Integer.valueOf( data.get( "maxParts" ) ) >= 1 && data.containsKey("answer_one" ) && data.containsKey( "answer_two_type" ) && sql.getString( "answer_one" ) != null && sql.getString( "answer_one" ).length() >= 4 ) {
                            //Если это обычный тест
                            if (  data.get( "answer_one_type" ).equals( "test" ) ) {
                                String [] goodAnswers = data.get( "answer_one" ).split( "\\|" ); //верные овтеты
                                String [] userAnswers = sql.getString( "answer_one" ).split( "," ); //ответы участника
                                int resultAnswers = 0; //результат тестирования

                                //Перебираем правильные ответы
                                for ( int i = 0; i <= goodAnswers.length - 1; i++) {
                                    //Если в ответах участника есть такой элемент и он равен правильному ответу
                                    if ( userAnswers.length - 1 >= i && goodAnswers[ i ].equals( userAnswers[ i ] ) ) {
                                        resultAnswers++; //прибавляем верные ответы
                                    }
                                }

                                row += delimiter + String.valueOf( resultAnswers ); //записываем посчитанные рузельтаты
                            }
                        }
                        //Если у олимпиады максимальное количество частей больше или равно 1-ой части, в ответах нет первой части и в базе у участника есть ответы на первую часть
                        else if ( Integer.valueOf( data.get( "maxParts" ) ) >= 1 && !data.containsKey("answer_one" ) && sql.getString( "answer_one" ) != null && sql.getString( "answer_one" ).length() >= 4 ) {
                            row += delimiter + sql.getString( "answer_one" ).replaceAll( "(\n|\r|\n\r|\r\n)", "" );
                        }
                        else {
                            row += delimiter + ""; //записываем пустую ячейку
                        }

                        row += delimiter + sql.getString( "answer_two" ); //записываем оригинальные ответы второй части

                        //Если у олимпиады максимальное количество частей больше или равно 2-ой части, в ответах есть вторая часть и в базе у участника есть ответы на вторую часть
                        if ( Integer.valueOf( data.get( "maxParts" ) ) >= 2 && data.containsKey("answer_two" ) && data.containsKey( "answer_two_type" ) && sql.getString( "answer_two" ) != null && sql.getString( "answer_two" ).length() >= 4 ) {
                            //Если это обычный тест
                            if (  data.get( "answer_two_type" ).equals( "test" ) ) {
                                String [] goodAnswers = data.get( "answer_two" ).split( "\\|" ); //верные овтеты
                                String [] userAnswers = sql.getString( "answer_two" ).split( "," ); //ответы участника
                                int resultAnswers = 0; //результат тестирования

                                //Перебираем правильные ответы
                                for ( int i = 0; i <= goodAnswers.length - 1; i++) {
                                    //Если в ответах участника есть такой элемент и он равен правильному ответу
                                    if ( userAnswers.length - 1 >= i && goodAnswers[ i ].equals( userAnswers[ i ] ) ) {
                                        resultAnswers++; //прибавляем верные ответы
                                    }
                                }

                                row += delimiter + String.valueOf( resultAnswers ); //записываем посчитанные рузельтаты
                            }
                        }
                        //Если у олимпиады максимальное количество частей больше или равно 2 частям, в ответах нет второй части и в базе у участника есть ответы на вторую часть
                        else if ( Integer.valueOf( data.get( "maxParts" ) ) >= 2 && !data.containsKey("answer_two" ) && sql.getString( "answer_two" ) != null && sql.getString( "answer_two" ).length() >= 4 ) {
                            row += delimiter + StringUtils.chomp( sql.getString( "answer_two" ).replaceAll( "(\n\r|\r\n)", "" ) );
                        }
                        else {
                            row += delimiter + ""; //записываем пустую ячейку
                        }

                        //Если у олимпиады максимальное количество частей больше или равно 3-ей части, в ответах есть третья часть и в базе у участника есть ответы на третью часть
                        if ( Integer.valueOf( data.get( "maxParts" ) ) >= 3 && data.containsKey("answer_three" ) && data.containsKey( "answer_three_type" ) && sql.getString( "answer_three" ) != null && sql.getString( "answer_three" ).length() >= 4 ) {
                            //Если это обычный тест
                            if (  data.get( "answer_three_type" ).equals( "test" ) ) {
                                String [] goodAnswers = data.get( "answer_three" ).split( "\\|" ); //верные овтеты
                                String [] userAnswers = sql.getString( "answer_three" ).split( "," ); //ответы участника
                                int resultAnswers = 0; //результат тестирования

                                //Перебираем правильные ответы
                                for ( int i = 0; i <= goodAnswers.length - 1; i++) {
                                    //Если в ответах участника есть такой элемент и он равен правильному ответу
                                    if ( userAnswers.length - 1 >= i && goodAnswers[ i ].equals( userAnswers[ i ] ) ) {
                                        resultAnswers++; //прибавляем верные ответы
                                    }
                                }

                                row += delimiter + String.valueOf( resultAnswers ); //записываем посчитанные рузельтаты
                            }
                        }
                        //Если у олимпиады максимальное количество частей больше или равно 3-ей части, в ответах нет третьей части и в базе у участника есть ответы на третью часть
                        else if ( Integer.valueOf( data.get( "maxParts" ) ) >= 3 && !data.containsKey("answer_three" ) && sql.getString( "answer_three" ) != null && sql.getString( "answer_three" ).length() >= 4 ) {
                            row += delimiter  + sql.getString( "answer_three" ).replaceAll( "(\n|\r|\n\r|\r\n)", "" );
                        }
                        else {
                            row += delimiter + ""; //записываем пустую ячейку
                        }

                        statisticStr += row + newLine; //добавляем строку в выходной файл статистики
                    }
                }
            }

            //Если команда выполнялась
            if ( isDoCommand ) {
                olimpStatisticFileWriter.write( statisticStr ); //пишем в файл статистику
                olimpStatisticFileWriter.close(); //закрываем элемент для записи в файл

                String date = new SimpleDateFormat("dd.MM.yyyy").format(Calendar.getInstance().getTime());
                MimeBodyPart textBody = new MimeBodyPart();

                textBody.setContent("Выгрузка по результату олимпиады по языкам от " + date + "<br/>Пояснение некоторых обозначений:<br/>1. 0 в колонке с результатом - нет совпадений с верными ответами<br/>" +
                        "2. Пустая колонка, null - нет данных<br/>" +
                        "3. В тексте символы t и r, отдёленные пробелом (пример hello t world) - специальный символ, на него внимание не обращать<br/>" +
                        "4. Символ ||| в ячейке - разделитель некоторых ответов, например развёрнутые ответы на вопросы", "text/html; charset=utf-8");

                MimeBodyPart fileBody = new MimeBodyPart();

                fileBody.setDataHandler(new DataHandler(new FileDataSource( olimpStatisticFile )));
                fileBody.setFileName("output_olimp_statistic_" + date + ".csv");

                //Если удалось отпарвить
                if ( sendMessage( email,"Выгрузка статистики " + date, textBody,  new MimeBodyPart[ ] {fileBody} ) ) {
                    outputText += "УСПЕШНО отрпавили письмо<br/>";
                }
                else {
                    outputText += "ОШИБКА при отправке письма: " + lastErrorText + "<br/>";
                }
            }

            //outputText += statisticStr;
            writepage( outputText, resp );
        }
        catch ( Exception err ) {
            outputText += err.toString() + "<br/>";
            writepage( outputText + "<br />" + err.toString(), resp );
        }
        finally {
            try { sql.close(); } catch ( Exception err ) {} //закрываем результат запроса

            closeConnect(); //закрываем коннект с бд

            try { olimpStatisticFileWriter.close(); } catch ( Exception err ) {} //закрываем элемент для записи в файл
            try { olimpStatisticFile.delete(); } catch ( Exception err ) {} //удаляем файл
        }
    }

    //Закрыть коннект с бд
    private void closeConnect () {
        if ( bd != null ) {
            bd.closeConnect();
        }
    }

    //Отправить письмо
    private Boolean sendMessage ( String email, String theme, MimeBodyPart textBody, MimeBodyPart [] file ) {
        try {
            Properties prop = new Properties();
            prop.put("mail.smtp.auth", "true");
            prop.put("socketFactory.port", "587");
            prop.put("mail.smtp.ssl.trust", "smtp.office365.com");
            prop.put("mail.smtp.starttls.enable", "true");
            prop.put("mail.smtp.host", "smtp.office365.com");
            prop.put("mail.smtp.port", "587");
            prop.put("mail.debug", "false");
            Session sessionSMTP = Session.getInstance(prop, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("eios@sgugit.ru", "Rctyz-Gbueif!");
                }
            });

            Message msg = new MimeMessage(sessionSMTP);
            msg.setFrom(new InternetAddress("eios@sgugit.ru"));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress( email ));
            msg.setSubject( theme );
            Multipart multi = new MimeMultipart();

            multi.addBodyPart( textBody );

            //Перебираем прикреплённые файлы и пиркрепляем
            for ( MimeBodyPart item : file ) {
                multi.addBodyPart( item );
            }

            msg.setContent( multi );

            Transport.send( msg );

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();

            return false;
        }
    }

    //написать на странице
    private void writepage ( String text, HttpServletResponse resp ) throws IOException {
        try {
            resp.getWriter().write( text );
            resp.getWriter().close();
        }
        catch ( Exception err ) {
            resp.getWriter().write( err.toString() );
            resp.getWriter().close();
        }
    }
}
