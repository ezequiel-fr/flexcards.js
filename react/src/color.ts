/**
 * Customized code found in this
 * [StackOverflow subject](https://stackoverflow.com/a/42966641/604861).\
 * So all credits goes to the post on this topic, and espcially to MultiplyByZer0.
 */
export default class RGBtoHSL {
    private r: number;
    private g: number;
    private b: number;

    private target: RGBtoHSL;
    private targetHSL: { h: number; s: number; l: number };

    constructor(r: number, g: number, b: number) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);

        this.target = this;
        this.targetHSL = this.target.hsl();
    }

    private clamp(value: number) {
        if (value > 255) { value = 255; }
        else if(value < 0) { value = 0; }
        return value;
    }

    private multiply(matrix: number[]) {
        let newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]),
            newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]),
            newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);

        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    private hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        let sin = Math.sin(angle), cos = Math.cos(angle);

        this.multiply([
            .213 + cos * .787 - sin * .213,
            .715 - cos * .715 - sin * .715,
            .072 - cos * .072 + sin * .928,
            .213 - cos * .213 + sin * .143,
            .715 + cos * .285 + sin * .140,
            .072 - cos * .072 - sin * .283,
            .213 - cos * .213 - sin * .787,
            .715 - cos * .715 + sin * .715,
            .072 + cos * .928 + sin * .072
        ]);
    }

    private sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)
        ]);
    }

    private saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value,
            0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value
        ]);
    }

    private brightness(value = 1) { this.linear(value) }
    private contrast(value = 1) { this.linear(value, -(.5 * value) + .5) }

    private linear(slope = 1, intercept = 0) {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }

    private invert(value = 1) {
        this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
    }

    private hsl() {
        let r = this.r / 255,
            g = this.g / 255,
            b = this.b / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if(max === min) h = s = 0;
        else {
            let d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 100, s: s * 100, l: l * 100 };
    }

    public solve() {
        let result = this.solveNarrow(this.solveWide());
        return this.toString(result.values);
    }

    private solveWide() {
        const A = 5, c = 15, a = [60, 180, 18000, 600, 1.2, 1.2];
        let best: { loss: number, values: number[] } = { loss: Infinity, values: [] };

        for (let i = 0; best.loss > 25 && i < 3; i++) {
            let initial = [50, 20, 3750, 50, 100, 100];
            let result = this.spsa(A, a, c, initial, 1000);

            if(result.loss < best.loss) best = result;
        }

        return best;
    }

    private solveNarrow(wide: { loss: number, values: number[] }) {
        const A = wide.loss;
        const c = 2, A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];

        return this.spsa(A, a, c, wide.values, 500);
    }

    private spsa(A: number, a: number[], c: number, values: number[], iters: number) {
        const alpha = 1, gamma = 1/6;

        let best = null,
            bestLoss = Infinity,
            deltas = new Array(6),
            highArgs = new Array(6),
            lowArgs = new Array(6);

        function fix(value: number, idx: number) {
            let max = 100;

            if (idx === 2) max = 7500;
            else if (idx === 4 || idx === 5) max = 200;

            if (idx === 3) {
                if (value > max) value %= max;
                else if (value < 0) value = max + value % max;
            } else if (value < 0) value = 0;
            else if (value > max) value = max;

            return value;
        }

        for (let k = 0; k < iters; k++) {
            let ck = c / Math.pow(k + 1, gamma);

            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > .5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            let lossDiff = this.loss(highArgs) - this.loss(lowArgs);

            for (let i = 0; i < 6; i++) {
                let g = lossDiff / (2 * ck) * deltas[i];
                let ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            let loss = this.loss(values);

            if (loss < bestLoss) { // @ts-ignore
                best = values.slice(0);
                bestLoss = loss;
            }
        }

        return { values: best || [], loss: bestLoss };
    }

    private loss(filters: number[]) {
        let color = new RGBtoHSL(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6); // 100 * 360
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        let colorHSL = color.hsl();

        return Math.abs(color.r - this.target.r) + Math.abs(colorHSL.h - this.targetHSL.h)
             + Math.abs(color.g - this.target.g) + Math.abs(colorHSL.s - this.targetHSL.s)
             + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.l - this.targetHSL.l);
    }

    private toString(filters: number[]) {
        const format = (idx: number, multiplier = 1) => Math.round(filters[idx] * multiplier);

        return `invert(${format(0)}%) `     + `sepia(${format(1)}%) `
             + `saturate(${format(2)}%) `   + `hue-rotate(${format(3, 3.6)}deg) `
             + `brightness(${format(4)}%) ` + `contrast(${format(5)}%)`;
    }
}
