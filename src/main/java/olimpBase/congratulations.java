package olimpBase;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import json.json;
import olimpBase.bd;
import olimpBase.information;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Map;
import java.util.Properties;

public class congratulations  {
    private String lastError = "";
    private String FIO = "";
    private String univer = "";
    private String userEmail = "";
    private String teacherFIO = "";

    public congratulations(){

    }

    public boolean sendCertificate(int userId){

        try {
         if (!isSend(userId)){
             //запрашиваем из БД ФИО, Университет, и email участника
             if (!getStudentFIO(userId)){
                 lastError = "не удалось получить ФИО";
                 return false;
             }


             if (!getStudentUniver(userId)){
                 lastError = "не удалось получить универ";
                 return false;
             }


             if (!getStudentMail(userId)){
                 lastError = "не удалось получить email";
                 return false;
             }


             //создаем Сертификат о прохождении олимпиады
             if (!(creatCertificate(FIO, univer, userId))){
                 lastError = "не удалсь создать сертификат";

                 return false;
             }



             //данные для smtp сервера
             final Map<String, Object> smtpConfig = (new olimpBase.information()).getSMTPInfo();

             Properties prop = new Properties();
             prop.put("mail.smtp.auth", "true");
             prop.put("socketFactory.port", smtpConfig.get( "port" ));
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

             MimeMessage msg = new MimeMessage(sessionSMTP);

             msg.setFrom(new InternetAddress(smtpConfig.get( "user" ).toString()));
             msg.setRecipient(Message.RecipientType.TO, new InternetAddress(userEmail));
             msg.setSubject("Окончание олимпиады");

             MimeBodyPart messageBodyPart = new MimeBodyPart();

             messageBodyPart.setContent("<html><body> Поздравляем с завершением олимпиады!!! ", "text/html; charset=utf-8");

             Multipart multipart = new MimeMultipart();
             multipart.addBodyPart(messageBodyPart);
             MimeBodyPart attachPart = new MimeBodyPart();
             String fileName = "/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/SL_modified"+ userId +".pdf";
             attachPart.attachFile(fileName);
             multipart.addBodyPart(attachPart);

             msg.setContent(multipart);

             Transport.send(msg);
             System.out.println("сертификат отправлен");
         }

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;

        }
    }

    private boolean getStudentFIO(int userId){

        bd bd = null;
        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }
            //*берем ФИО из бд
            StringBuilder FIOb = new StringBuilder();

            //Фамилия
            Object sqlResultTmp = bd.query("SELECT second_name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("second_name")).append(" ");

            //Имя
            sqlResultTmp = bd.query("SELECT name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("name")).append(" ");



            //Отчество
            sqlResultTmp = bd.query("SELECT three_name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("three_name"));

            FIO = FIOb.toString();

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;

        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    private boolean getStudentUniver(int userId){
        bd bd = null;
        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }
            //*берем университет из бд
            Object sqlResultTmp = bd.query("SELECT univer FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            univer = sqlResult.getString("univer");

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;

        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    private boolean getStudentMail(int userId){
        bd bd = null;
        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }
            //*берем университет из бд

            Object sqlResultTmp = bd.query("SELECT student_email FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            userEmail = sqlResult.getString("student_email");

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;

        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    private boolean creatCertificate(String FIO,String univer, int userId) throws IOException {

        try {
            PdfReader reader = new PdfReader("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/SL.pdf"); // input PDF
            PdfStamper stamper = new PdfStamper(reader, new FileOutputStream("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/SL_modified" + userId + ".pdf")); // output PDF
            BaseFont bf = BaseFont.createFont("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/fonts/languages/TimesNewRoman.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED); // set font
            BaseFont ba = BaseFont.createFont("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/fonts/languages/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED); // set font
            //loop on pages (1-based)
            for (int i=1; i<=reader.getNumberOfPages(); i++){

                // get object for writing over the existing content;
                // you can also use getUnderContent for writing in the bottom layer
                PdfContentByte over = stamper.getOverContent(i);

                // создание белого прямоугольника
                over.rectangle(20, 410, 600, 110);
                over.setColorFill(BaseColor.WHITE);
                over.setRGBColorStroke(0xFF, 0xFF, 0xFF);
                over.fill();
                over.stroke();

                // Вставка текста
                over.setColorFill(BaseColor.BLACK);
                over.beginText();
                over.setFontAndSize(bf, 28);    // set font and size
                over.showTextAligned(PdfContentByte.ALIGN_CENTER, FIO, 300 , 492 , 0);
                over.endText();

                over.setColorFill(BaseColor.BLACK);
                over.beginText();
                over.setFontAndSize(ba, 16);    // set font and size
                over.showTextAligned(PdfContentByte.ALIGN_CENTER, univer, 300 , 462 , 0);
                over.endText();

            }

            stamper.close();
            return true;
        }catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;
        }

    }

    private boolean isSend(int userId){
        bd bd = null;
        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }

            Object sqlResultTmp = bd.query("SELECT send_certificate FROM users WHERE id = " + String.valueOf(userId));

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            if (sqlResult.getInt("send_certificate") == 0){
                bd.insertQuery( "UPDATE users SET send_certificate = 1 WHERE id = " + String.valueOf( userId ) );


                return false;
            }

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();
            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    public boolean sendBless(){
        bd bd = null;
        try{
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }

            Object sqlResultTmp = bd.query( "SELECT DISTINCT teacher_email FROM users" );

            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при выборе почты: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp;

            ArrayList<String> emails = new ArrayList<String>();

            while (sqlResult.next()){
            emails.add(sqlResult.getString("teacher_email"));
            }

            for (String email : emails){
                sqlResultTmp = bd.query( "SELECT id FROM users WHERE teacher_email = '"+ email +"'" );

                if ( sqlResultTmp instanceof Boolean ) {
                    throw new Exception( "Ошибка при выборе id: " + bd.getLastTextError() );
                }

                sqlResult = (ResultSet) sqlResultTmp;

                if ( !sqlResult.next() ) {
                    throw new Exception( "Ошибка при работе с бд : не удалось получить id" );
                }

                int userId = sqlResult.getInt("id");

                if (!getStudentUniver(userId)){
                    lastError = "не удалось получить универ";
                    return false;
                }

                if (!getTeacherFIO(userId)){
                    lastError = "не удалось получить ФИО преподавателя";
                    return false;
                }
                //создаем Bless о прохождении олимпиады
                if (!(creatBless(teacherFIO, univer, userId))){
                    lastError = "не удалсь создать bless";

                    return false;
                }

                //данные для smtp сервера
                final Map<String, Object> smtpConfig = (new olimpBase.information()).getSMTPInfo();

                Properties prop = new Properties();
                prop.put("mail.smtp.auth", "true");
                prop.put("socketFactory.port", smtpConfig.get( "port" ));
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

                MimeMessage msg = new MimeMessage(sessionSMTP);

                msg.setFrom(new InternetAddress(smtpConfig.get( "user" ).toString()));
                msg.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
                msg.setSubject("Олимпиада по английскому, немецкому и русскому языкам в 2020 году");

                MimeBodyPart messageBodyPart = new MimeBodyPart();

                messageBodyPart.setContent("<html><body>Объявляется благодарность по всероссийской онлайн-олимпиаде по иностранным (английскому и немецкому) и русскому языкам «УМНЫЕ ГОРОДА – ФИЗИЧЕСКАЯ И ЦИФРОВАЯ ИНФРАСТРУКТУРА», благодарность за подготовку студентов ", "text/html; charset=utf-8");

                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(messageBodyPart);
                MimeBodyPart attachPart = new MimeBodyPart();
                String fileName = "/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/BL_modified"+ userId +".pdf";
                attachPart.attachFile(fileName);
                multipart.addBodyPart(attachPart);

                msg.setContent(multipart);

                Transport.send(msg);
                System.out.println("сертификат отправлен");
            }


            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;
        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    private boolean getTeacherFIO(int userId){

        bd bd = null;
        try {
            bd = new bd( new information().getBDInfo() );

            if ( !bd.connect() ) {
                throw new Exception( "Ошибка при коннекте к бд: " + bd.getLastTextError() );
            }
            //*берем ФИО из бд
            StringBuilder FIOb = new StringBuilder();

            //Фамилия
            Object sqlResultTmp = bd.query("SELECT teacher_second_name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            ResultSet sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("teacher_second_name")).append(" ");

            //Имя
            sqlResultTmp = bd.query("SELECT teacher_name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("teacher_name")).append(" ");



            //Отчество
            sqlResultTmp = bd.query("SELECT teacher_three_name FROM users WHERE id = '" + userId + "'");

            //Если вернулся булевский тип, значит ошибка
            if ( sqlResultTmp instanceof Boolean ) {
                throw new Exception( "Ошибка при поиске имени: " + bd.getLastTextError() );
            }

            sqlResult = (ResultSet) sqlResultTmp; //результат выполнения запроса

            //если нет первого элемента, значит ошибка
            if ( !sqlResult.next() ) {
                throw new Exception( "Ошибка при работе с бд" );
            }

            FIOb.append(sqlResult.getString("teacher_three_name"));

            teacherFIO = FIOb.toString();

            return true;
        }
        catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;

        }
        finally {
            if ( bd != null ) {
                bd.closeConnect();
            }
        }
    }

    private boolean creatBless(String FIO,String univer, int userId) throws IOException {

        try {
            PdfReader reader = new PdfReader("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/BL.pdf"); // input PDF
            PdfStamper stamper = new PdfStamper(reader, new FileOutputStream("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/files/BL_modified" + userId + ".pdf")); // output PDF
            BaseFont bf = BaseFont.createFont("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/fonts/languages/TimesNewRoman.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED); // set font
            BaseFont ba = BaseFont.createFont("/opt/glassfish5.0/glassfish5/glassfish/domains/olimp/applications/olimp/resources/fonts/languages/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED); // set font
            //loop on pages (1-based)
            for (int i=1; i<=reader.getNumberOfPages(); i++){

                // get object for writing over the existing content;
                // you can also use getUnderContent for writing in the bottom layer
                PdfContentByte over = stamper.getOverContent(i);

                // создание белого прямоугольника
                over.rectangle(20, 420, 600, 135);
                over.setColorFill(BaseColor.WHITE);
                over.setRGBColorStroke(0xFF, 0xFF, 0xFF);
                over.fill();
                over.stroke();

                // Вставка текста
                over.setColorFill(BaseColor.BLACK);
                over.beginText();
                over.setFontAndSize(bf, 28);    // set font and size
                over.showTextAligned(PdfContentByte.ALIGN_CENTER, FIO, 300 , 500 , 0);
                over.endText();

                over.setColorFill(BaseColor.BLACK);
                over.beginText();
                over.setFontAndSize(ba, 16);    // set font and size
                over.showTextAligned(PdfContentByte.ALIGN_CENTER, univer, 300 , 470 , 0);
                over.endText();

            }

            stamper.close();
            return true;
        }catch (Exception err){
            lastError += lastError + "\nsendCET: " + err.getMessage();

            return false;
        }

    }


    public String getLastError() {
        return lastError;
    }


}