let a = [1,2,3,4,5]
let b = [1,6,2,7]

// if (b.filter(x => !a.includes(x)).length != 0) {
//     console.log(b.filter(x => !a.includes(x)));
// }
console.log(a.filter(x => !b.includes(x)))