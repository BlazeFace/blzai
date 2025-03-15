export function getFontSize(): string {
    let element = document.querySelector('h1');
    if (!element) return "16 px";
    let style = window.getComputedStyle(element);
    return style.getPropertyValue('font-size');
}

export function roughTextWidth(text: string, fontSize: number): number {
    return text.length * fontSize;
}

export function rowWidths(values: any[], runeSize: number): number[] {
    const widths: number[] = new Array(values.length).fill(0);
    for (let i = 0; i < values.length; i++) {
        widths[i] = Math.max((roughTextWidth((values[i] ?? "").toString(), runeSize) + 14), 80);
    }
    return widths;
}

export function calculateTextWidth(text: string, font: string): number {
    // Create a temporary canvas context to measure the text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
        context.font = font;
        const metrics = context.measureText(text);
        return (metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft);
    }

    return 0;
}

export function replaceIfGreater(source: any[], compare: any[]) : number[] {
    return source.map((value, index) => value > (compare[index] || 0) ? value : compare[index]);
}

export function buildWhereIn(selections: Map<string, Set<string>>): string {
    let whereIn = "";
    for (const [key, setItems] of selections) {
        const items = Array.from(setItems);
        if (items.length > 0) {
            whereIn += `AND `;
            if (items.length > 0) {
                whereIn += `${key} IN (${items.map((v) => `'${v}'`).join(",")})`;
            }
        }
    }
    return whereIn;
}