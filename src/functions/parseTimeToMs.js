function parseTimeToMs(timeString) {
    const regex = /(\d+)\s*(ms|m|s|h|d)?/g;
    const matches = Array.from(timeString.matchAll(regex));
    let totalTimeMs = 0;
    for (const match of matches) {
        const [, value, unit] = match;
        const numericValue = parseInt(value, 10);
        let timeInMs = numericValue;
        if (unit) {
            switch (unit) {
                case 'ms':
                    timeInMs = numericValue;
                    break;
                case 's':
                    timeInMs = numericValue * 1000;
                    break;
                case 'min':
                    timeInMs = numericValue * 60000;
                    break;
                case 'h':
                    timeInMs = numericValue * 3600000;
                    break;
                case 'd':
                    timeInMs = numericValue * 86400000;
                    break;
            }
        }
        totalTimeMs += timeInMs;
    }
    return totalTimeMs;
}

module.exports = { parseTimeToMs: parseTimeToMs};
