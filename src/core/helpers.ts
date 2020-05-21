export function addOrSubsDayToDate(date: Date, numberOfDay: number): Date {
    const dat = new Date(date);
    return new Date(dat.setDate(dat.getDate() + numberOfDay));
}

