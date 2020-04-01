function pearson(x, y){
  let promedio = (lista) => { return lista.reduce((s, a) => s + a, 0) / lista.length };
  let n = x.length, prom_x = promedio(x) , prom_y = promedio(y);
  return (x.map( (e, i, r) => (r = {x:e, y:y[i]}) ).reduce( (s, a) => s + a.x * a.y, 0) - n * prom_x * prom_y) /
      ((Math.sqrt(x.reduce( (s, a) => (s + a * a) , 0) - n * prom_x * prom_x)) *
          (Math.sqrt(y.reduce( (s, a) => (s + a * a) , 0) - n * prom_y * prom_y)));
} 