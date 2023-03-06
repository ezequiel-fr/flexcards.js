export default class RGBtoHSL {
    private r;
    private g;
    private b;
    private target;
    private targetHSL;
    constructor(r: number, g: number, b: number);
    private clamp;
    private multiply;
    private hueRotate;
    private sepia;
    private saturate;
    private brightness;
    private contrast;
    private linear;
    private invert;
    private hsl;
    solve(): string;
    private solveWide;
    private solveNarrow;
    private spsa;
    private loss;
    private toString;
}
