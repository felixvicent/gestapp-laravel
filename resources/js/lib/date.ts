import {format, parseISO} from "date-fns";
import {ptBR} from "date-fns/locale";

export function formatDate(date: Date | string, pattern = 'dd/MM/yyyy') {
    const parsedDate = typeof date === 'string'
        ? parseISO(date)
        : date;

    return format(parsedDate, pattern, { locale: ptBR });
}
