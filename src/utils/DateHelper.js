const Day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const Month = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
};

export function getDateFormated(stringDate) {
    const date = new Date(stringDate);
    let tokens = date.toString().split(":");
    tokens.pop();
    tokens = tokens.join(":").split(" ");
    tokens[1] = Month[tokens[1]];
    const temp = tokens[1];
    tokens[1] = tokens[2];
    tokens[2] = temp;
    return tokens.join(" ");
}

export function getTime(stringDate) {
    const date = new Date(stringDate);
    return `${date.getHours()}:${date.getMinutes()}`;
}
