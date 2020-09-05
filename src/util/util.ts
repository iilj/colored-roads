export const hsl2rgb = (h: number, s: number = 100, l: number = 40) => {
    let max, min;
    const rgb = { 'r': 0, 'g': 0, 'b': 0 };

    while (h >= 360) h -= 360;
    while (h < 0) h += 360;

    if (l <= 49) {
        max = 2.55 * (l + l * (s / 100));
        min = 2.55 * (l - l * (s / 100));
    } else {
        max = 2.55 * (l + (100 - l) * (s / 100));
        min = 2.55 * (l - (100 - l) * (s / 100));
    }

    if (h < 60) {
        rgb.r = max;
        rgb.g = min + (max - min) * (h / 60);
        rgb.b = min;
    } else if (h >= 60 && h < 120) {
        rgb.r = min + (max - min) * ((120 - h) / 60);
        rgb.g = max;
        rgb.b = min;
    } else if (h >= 120 && h < 180) {
        rgb.r = min;
        rgb.g = max;
        rgb.b = min + (max - min) * ((h - 120) / 60);
    } else if (h >= 180 && h < 240) {
        rgb.r = min;
        rgb.g = min + (max - min) * ((240 - h) / 60);
        rgb.b = max;
    } else if (h >= 240 && h < 300) {
        rgb.r = min + (max - min) * ((h - 240) / 60);
        rgb.g = min;
        rgb.b = max;
    } else if (h >= 300 && h < 360) {
        rgb.r = max;
        rgb.g = min;
        rgb.b = min + (max - min) * ((360 - h) / 60);
    }

    rgb.r = Math.round(rgb.r);
    rgb.g = Math.round(rgb.g);
    rgb.b = Math.round(rgb.b);
    return rgb;
};

export const RGB2ColorCode = (r: number, g: number, b: number) => {
    let rs, gs, bs;
    rs = r.toString(16);
    if (rs.length === 1) rs = "0" + r;

    gs = g.toString(16);
    if (gs.length === 1) gs = "0" + g;

    bs = b.toString(16);
    if (bs.length === 1) bs = "0" + b;

    return '#' + rs + gs + bs;
}

export const calcAtanDeg = (x: number, y: number) => {
    return Math.atan2(y, x) * 180 / Math.PI;
}

export const range = (start: number, stop: number) => Array.from({ length: (stop - start) + 1 }, (_, i) => start + i);