//redonde a 2 decimales (centavos) para evitar errores como 0.1 + 0.2 = 0.3000000000
export const redondear = (valor:number)=>Math.round(valor*100)/100;