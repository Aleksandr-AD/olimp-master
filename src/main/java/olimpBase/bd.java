package olimpBase;

import java.sql.*;
import java.util.Map;

import org.postgresql.Driver;

public class bd {
    private String lastErrorText = ""; //текст последней ошибки
    private Boolean isRegisterDriver = false; //индикатор регитсарции драйвера Postgre
    private Map< String, Object > bdInfo = null;
    private Connection con = null; //соединение с бд
    private Statement stmt = null; //контейнер для выполнения запросов в коннекте
    private ResultSet sql = null; //результат выполнения команды

    public bd ( Map< String, Object > info ) {
        bdInfo = info;
    }

    //Получение текущего коннекта
    public Connection getConnectInstance () {
        return con;
    }

    //Выполнить запрос
    public Object query ( String sqlQuery ) {
        try {
            if ( con == null && !connect() ) {
                lastErrorText = "Необходимо соединиться с БД";

                return false;
            }

            sql = stmt.executeQuery( sqlQuery );

            return sql;
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();

            return false;
        }
    }
    //Выполнить запрос на вставку
    public Boolean insertQuery ( String sqlQuery ) {
        try {
            if ( con == null && !connect() ) {
                lastErrorText = "Необходимо соединиться с БД";

                return false;
            }

            stmt.executeUpdate( sqlQuery );

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();

            return false;
        }
    }
    //Выполнить запрос на удаление
    public Boolean deleteQuery ( String sqlQuery ) {
        try {
            if ( con == null && !connect() ) {
                lastErrorText = "Необходимо соединиться с БД";

                return false;
            }

            stmt.executeUpdate( sqlQuery );

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();

            return false;
        }
    }

    //Создание коннекта
    public Boolean connect () {
        try {
            if ( !registerDriver() ) {
                return false;
                
            }

            if ( con != null && stmt != null ) {
                return true;
            }

            con = DriverManager.getConnection("jdbc:postgresql://" + bdInfo.get( "host" ) + (bdInfo.get( "port" ) instanceof Boolean ? ":" + bdInfo.get( "port" ) : "") + "/" + bdInfo.get( "bd" ) + "?useUnicode=" + bdInfo.get( "useUnicode" ) + "&charSet=" + bdInfo.get( "charSet" ) + "&characterEncoding=" + bdInfo.get( "characterEncoding" ), bdInfo.get( "user" ).toString(),  bdInfo.get( "password" ).toString());
            stmt = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();
            closeConnect ();

            return false;
        }
    }
    //Регистрация драйвера
    private Boolean registerDriver () {
        try {
            if (!isRegisterDriver) {
                DriverManager.registerDriver(new Driver());

                isRegisterDriver = true;
            }

            return true;
        }
        catch ( Exception err ) {
            lastErrorText = err.getMessage();

            return false;
        }
    }
    //Закрывание коннекта
    public void closeConnect () {
        try { con.close(); con = null; } catch (Exception err) { }
        try { stmt.close(); stmt = null; } catch (Exception err) { }
        try { sql.close(); sql = null; } catch (Exception err) { }
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
