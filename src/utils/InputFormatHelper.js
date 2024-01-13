export function getStandardText(text) {
    let result = text.replaceAll("<div><br></div>", "<br>");
    result = result.replaceAll("</div><div>", "<br>");
    const end = result.lastIndexOf("</div>");
    result = result.substring(0, end + 6);
    const found = result.match(/>\w+<|\w+/);

    return found == null ? "" : result;
}