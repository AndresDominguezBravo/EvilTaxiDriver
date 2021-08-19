

const numeroCasillas = 20;

function start(){
    document.getElementsByClassName("menuPrincipal")[0].remove();
    let mapTablero = new Map();
    generarMundoDisplay();
    elementCasillasToMap(mapTablero);

}

const tipoCasilla = {
	CARRETERA: "carretera",
	EDIFICIO: "edificio",
	RUTA: "ruta",
	CLIENTE: "cliente"
}

/**
 * Requerimiento para que una carretera sea valida.
 * 
 * una carretera tiene que tener almenos una carretera en su linea horizontal o vertical, siempre y cuando esa unica salida tenga una carretera que tenga mas de 1 salida.
 * 
 * si tengo autovias en las lineas con modulo de 5 el maximos de un grupo de carreteras desconectadas de la via es 12 si una carretera no conecta con 12 carreteras diferentes o mas 
 * esta fuera de mi mapa.
 * 
 * Buscar partrones de 3 x 3 y 4 x 4 en bucle que esten llenos de carreteras y una vez encuentes 1 rellenas el centro del patron con edificios.
 * 
 * Buscar carreteras rodeadas de edificios para tenerlas encuenta para descartarlas del juego. 
 */

function generarMundoDisplay(){

    var divCasilla = document.createElement("div");
    
    var tablero = document.getElementsByClassName("tablero");
    var fila = document.createElement("div");
    fila.classList.add("fila");
    for(var i = 1 ; i<numeroCasillas ; i++){
        for(var j = 1 ; j<numeroCasillas ; j++){
            divCasilla.classList.add("casilla");
            divCasilla.classList.add(tipoCasilla.CARRETERA);

            if(isAutovia(i,j)){
                if(isEdificio()){
                    divCasilla.classList.add(tipoCasilla.EDIFICIO);
                }
        }
            fila.appendChild(divCasilla.cloneNode(true));            
            divCasilla.classList = "";
            
        }

        tablero[0].appendChild(fila.cloneNode(true));
        fila.innerHTML = "";
        
    }
}
function isAutovia(i,j){
    return i%5!==0 && j%5!==0
}
function isEdificio() {
    let numero = Math.random() * 10 + 1;
    if (numero > 6) {
        return true;
    } else {
        return false;
    }
}

function buscarCarreterasInvalidas(mapTablero){
    for(var columna = 0 ; columna<numeroCasillas ; columna++){
        for(var fila = 0 ; fila<numeroCasillas ; fila++){
            let casilla = mapTablero.get(columna+"-"+fila);
            if(casilla.classList.contains(tipoCasilla.CARRETERA)){
                let casillasVecinas = [];
                if(columna === 0 && fila === 0){
                    casillasVecinas.add(mapTablero.get(columna + 1 +"-"+fila));
                    casillasVecinas.add(mapTablero.get(columna +"-"+fila + 1));
                }else if(columna === numeroCasillas-1 && fila === numeroCasillas-1){
                    casillasVecinas.add(mapTablero.get(columna - 1 +"-"+fila));
                    casillasVecinas.add(mapTablero.get(columna +"-"+fila - 1));
                }else if(columna === 0 && fila === numeroCasillas-1){
                    casillasVecinas.add(mapTablero.get(columna + 1 +"-"+fila));
                    casillasVecinas.add(mapTablero.get(columna +"-"+fila - 1));
                }else if(columna === numeroCasillas-1 && fila === 0){
                    casillasVecinas.add(mapTablero.get(columna + 1 +"-"+fila));
                    casillasVecinas.add(mapTablero.get(columna +"-"+fila - 1));
                }
            }

        }
    }
}

function elementCasillasToMap(mapTablero){

    var casillas = document.getElementsByClassName("casilla");
    var columna = 0;
    var fila = 0;
    for( let casilla of casillas){
        mapTablero.set(columna+"-"+fila,casilla);
        columna++;

        if(columna%numeroCasillas==0){
            columna = 0;
            fila++;
        }
    }
    console.log(mapTablero);

}

start();