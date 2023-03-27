import { transform, getFonts } from "convert-unicode-fonts";
import { config } from "../../../config.js";

const fonts = getFonts();

export default function convertToUnicode(text: string, font?: string) {
    if (text.includes("§")) text.replaceAll("§", "s");
    const s = transform(text, fonts[`${config.unicodeFont}`])
    return s;
}   