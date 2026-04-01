export function formatDateForDisplay(dateStr: string | null | undefined, fallback = ""): string {
    if (!dateStr) return fallback;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.substring(0, 10).split("-");
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

export function parseDateForInput(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.substring(0, 10);
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
    }
    return dateStr;
}
