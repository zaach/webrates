var db = new Firebase('https://sweltering-fire-6680.firebaseio.com/rates');

function submitData(data) {
  db.push(data);
}
