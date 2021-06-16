package olimpBase;

import java.text.SimpleDateFormat;
import java.util.GregorianCalendar;

public class times {
    GregorianCalendar nowDate = new GregorianCalendar(); //текущая дата
    String lastErrorText = ""; //текст последней ошибки

    GregorianCalendar minDate = null; //минимальная дата
    GregorianCalendar maxDate = null; //максимальная дата

    public times ( String minDateTime, String maxDateTime ) {
        try {
            minDate = new GregorianCalendar();
            maxDate = new GregorianCalendar();
            minDate.setTimeInMillis( new SimpleDateFormat( "HH:mm dd.MM.yyyy" ).parse( minDateTime ).getTime() );
            maxDate.setTimeInMillis( new SimpleDateFormat( "HH:mm dd.MM.yyyy" ).parse( maxDateTime ).getTime() );
            maxDate.add( GregorianCalendar.MINUTE, 10 ); //добавляем 10 минут, для опаздашек
        }
        catch ( Exception err ) {
            lastErrorText = err.toString();
        }
    }

    //Проверка текущего времени по ограничениям
    public Boolean checkCurrentTime () {
        return nowDate.compareTo( minDate ) >= 1 && nowDate.compareTo( maxDate ) <= 0;
    }

    //Получить текст последней ошибки
    public String getLastTextError () {
        return lastErrorText;
    }
}
