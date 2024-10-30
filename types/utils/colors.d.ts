/**
 * Customized code found in this
 * [StackOverflow subject](https://stackoverflow.com/a/42966641/604861).\
 * So all credits goes to the post on this topic, and espcially to MultiplyByZer0.
 */
declare class RGBtoHSL {
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
    hsl(): {
        h: number;
        s: number;
        l: number;
    };
    solve(): string;
    private solveWide;
    private solveNarrow;
    private spsa;
    private loss;
    private toString;
}
export default RGBtoHSL;
