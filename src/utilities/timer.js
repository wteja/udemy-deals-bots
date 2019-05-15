const delay = time => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), time * 1000);
    });
};

const randomDelay = (min, max) => {
    min = min || 5;
    max = max || 10;
    if(min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    const time = (Math.random() * (max - min + 1)) + min;
    return delay(time);
}

module.exports = {
    delay,
    randomDelay
};