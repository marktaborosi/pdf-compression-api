export function buildGhostscriptCommand(profile: string, input: string, output: string): string {
    return `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${profile} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${output} ${input}`;
}
