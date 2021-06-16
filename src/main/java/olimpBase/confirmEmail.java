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

@WebServlet( name="confirmEmail", urlPatterns = {"/confirm_email", "/confirm_email/"})
public class confirmEmail extends HttpServlet {
    private String lastError = "";

    //Создание токена подтверждения почты и отпарвка его по почте
    public boolean sendConfirmEmailToken( String userID, String userPassword ) {
        bd bd = null;

        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }

            //генерируем токен
            String token = genToken();

            //Ели токен не удалось сгенерировать
            if ( token == null ) {
                throw new Exception( "Не удалось сгенерировать новый токен" );
            }

            //вставляем запись с токеном
            bd.insertQuery( "INSERT INTO confirm_email (token, id_user) VALUES ('" + token + "', " + userID + ")" );
            //выбираем нашу новую запись
            Object sqlResultTmp = bd.query( "SELECT COUNT(id) AS count FROM confirm_email WHERE token = '" + token + "' AND id_user = " + userID );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске нового токена: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            //Если количество не равно 1, значит токена нет (почта либо активирована, либо токен неверный)
            if ( sqlResult.getInt( "count" ) != 1 ) {
                throw new Exception( "Новый токен не найден" );
            }

            //выбираем почту пользователя
            sqlResultTmp = bd.query( "SELECT student_email FROM users WHERE id = " + userID );

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске пользователя: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд при поиске пользователя" );
            }

            //Почта пользователя
            String userEmail = sqlResult.getString( "student_email" );

            //возвращаем результат отпарвки почты
            return sendEmail( userEmail, token, userID, userPassword );
        }
        catch ( Exception err ) {
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }
    //генерация токена
    private String genToken( ) {
        try {
            //алфавит символов токена
            String words = "bgQt8OrAf9UvJ5ZIcMKDdeC643w7sxNzSaEHWq0Ymjyt1hnXiTkVP2GlBop";
            //токен
            String token = "";

            //перебираем количество нужных символов в токене
            for ( int i = 1; i <= 10; i++ ) {
                //рандомный индекс символа
                int index = new Random().nextInt( words.length());
                //добавляем наш символ
                token += words.substring( index, index + 1 );
            }

            return token;
        }
        catch ( Exception err ) {
            lastError += lastError + "\ngenT: " + err.getMessage();

            return null;
        }
    }

    //отправляем почту
    private boolean sendEmail( String userEmail, String token, String userID, String userPassword ) {
        try {
            //данные для smtp сервера
            final Map <String, Object> smtpConfig = (new information()).getSMTPInfo();

            Properties prop = new Properties();
            prop.put("mail.smtp.auth", "true");
            prop.put("socketFactory.port", smtpConfig.get( "port" ));
            //prop.put("socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            prop.put("mail.smtp.ssl.trust", smtpConfig.get("host"));
            prop.put("mail.smtp.starttls.enable", smtpConfig.get( "ssl" ) instanceof Boolean && (Boolean) smtpConfig.get( "ssl" ) ? "true" : "false");
            prop.put("mail.smtp.host", smtpConfig.get("host"));
            prop.put("mail.smtp.port", smtpConfig.get( "port" ));
            prop.put("debug", "true");
            Session sessionSMTP = Session.getInstance(prop, new Authenticator() {
                String email = smtpConfig.get( "user" ).toString();
                String password = smtpConfig.get( "password" ).toString();

                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(email, password);
                }
            });
            sessionSMTP.setDebug( false );

            Message msg = new MimeMessage(sessionSMTP);
            msg.setFrom(new InternetAddress(smtpConfig.get( "user" ).toString()));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(userEmail));
            msg.setSubject("Подтверждение почты участника олимпиады");
            msg.setText("Тема: Подтверждение почты участника олимпиады\nСообщение:\nДля подтверждения почты необходимо в браузере открыть ссылку https://olimp.sgugit.ru/confirm_email?t=" + token);
            msg.setContent("<html><body>" +
                    "Для подтверждения почты перейдите по <a href=\"https://olimp.sgugit.ru/confirm_email/page?t=" + token + "\">ссылке</a> или откройте в браузере самостоятельно https://olimp.sgugit.ru/confirm_email/page?t=" + token +
                    "<br/><br/>Логин/Пароль: " + userID + "/" + userPassword + "<br/><br/>Если получили это письмо по ошибке, просто проигнорируйте", "text/html; charset=utf-8");

            Transport.send(msg);

            return true;
        }
        catch ( Exception err ) {
            lastError += lastError + "\nsendE: " + err.getMessage();

            return false;
        }
    }

    public String getLastError() {
        return lastError;
    }
}