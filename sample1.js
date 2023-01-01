
// let temps = [-2, -1, 4, 8, 10, -1, 0];

// let reportTemps = temps.map(temp => {
//    if (temp < 0) {
//       return "negativa";
//    } else {
//       return "positva";
//    }
// });

//console.log(reportTemps); 

let redeSociais = [
   "https://facebook.com/", 
   "https://linkedin.com/", 
   "https://instagram.com/"
];

let redeSociaisMorga = redeSociais.map(rs => {
   return rs + "morgaperini";
});

console.log(redeSociaisMorga);

// ===== FOR
let temps = [-2, -1, 4, 8, 10, -1, 0];
let somaTemp = 0;

for (const temp of temps) {
   somaTemp = somaTemp + temp;
}

let mediaTemp = somaTemp / temps.length

console.log(mediaTemp);

// ===== REDUCE
let somaTemps2 = temps.reduce((acc, temp, index) => {
   console.log("Lugar atual do array para o reduce: ", index);
   return acc + temp
}, 0);

console.log(somaTemps2 / temps.length);