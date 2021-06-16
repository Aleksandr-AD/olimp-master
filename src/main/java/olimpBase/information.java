package olimpBase;

import java.util.HashMap;
import java.util.Map;

public class information {
    Map< String, Object > bd = new HashMap<String, Object>();
    Map< String, Object > smtp = new HashMap<String, Object>();

    public information () {
        bd.put( "host", "10.2.136.132" );
        bd.put( "port", "5432" );
        bd.put( "user", "olimp" );
        bd.put( "password", "Jkbvgbflf" );
        bd.put( "bd", "olimp" );
        bd.put( "useUnicode", "true" );
        bd.put( "charSet", "UTF-8" );
        bd.put( "characterEncoding", "UTF-8" );

        smtp.put( "host", "smtp.office365.com" );
        smtp.put( "port", "587" );
        smtp.put( "user", "eios@sgugit.ru" );
        smtp.put( "password", "Rctyz-Gbueif!" );
        smtp.put( "ssl", true );
        smtp.put( "isAuth", true );
    }

    public Map< String, Object > getBDInfo () {
        return bd;
    }

    public Map< String, Object > getSMTPInfo () {
        return smtp;
    }
}
