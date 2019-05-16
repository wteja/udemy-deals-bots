const delay = time => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), time * 1000);
    });
};

const randomDelay = (min, max) => {
    min = min || 3;
    max = max || 5;
    if(min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    const time = (Math.random() * (max - min + 1)) + min;
    return delay(time);
}

const eachDelay = (items, time, cb) => {
    let seed = time;
    items.forEach(item => {
        setTimeout(cb, seed * 1000)
        seed += time
    })
}

module.exports = {
    delay,
    randomDelay,
    eachDelay
};