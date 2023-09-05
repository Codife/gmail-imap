const arr = [2, 3, 7, 9, 10, 343, 100, -3003]

const sum = arr.reduce((acc, cur) => {
    let stringVar = cur.toString();
    let num = stringVar.includes('-') ? stringVar.replace('-', '') : stringVar;
    let str = '';
    if (num.length === 1) return acc
    for (let i = num.length - 1; i >= 0; i--) {
        str = str + num[i];
    }
    if (stringVar.includes('-')) str = '-' + str
    if (stringVar === str) {
        acc = acc + cur
        return acc
    } else {
        return acc
    }
}, 0)

console.log(sum)