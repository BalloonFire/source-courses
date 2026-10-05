const htmlEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  copy: "\u00a9",
  gt: ">",
  ldquo: "\u201c",
  lsquo: "\u2018",
  mdash: "\u2014",
  nbsp: " ",
  ndash: "\u2013",
  quot: '"',
  rdquo: "\u201d",
  reg: "\u00ae",
  rsquo: "\u2019",
  trade: "\u2122",
};

export function htmlToText(html: string): string {
  return html
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<\s*br\b[^>]*>/gi, "\n")
    .replace(/<\s*li\b[^>]*>/gi, "- ")
    .replace(/<\s*\/\s*li\s*>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|h[1-6]|ul|ol|blockquote|pre)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] === "#") {
        const isHex = code[1]?.toLowerCase() === "x";
        const value = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);

        if (value > 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff)) {
          return String.fromCodePoint(value);
        }

        return entity;
      }

      return htmlEntities[code.toLowerCase()] ?? entity;
    })
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}