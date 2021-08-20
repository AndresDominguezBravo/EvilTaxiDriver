const numeroCasillas = 12;

function start() {
    document.getElementsByClassName("menuPrincipal")[0].remove();
    let mapTablero = new Map();
    generarMundoDisplay();
    elementCasillasToMap(mapTablero);
    //buscarCarreterasInvalidas(mapTablero);
    cuantosEdificosPorCasilla(mapTablero);
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

function generarMundoDisplay() {

    var divCasilla = document.createElement("div");

    var tablero = document.getElementsByClassName("tablero");
    var fila = document.createElement("div");
    fila.classList.add("fila");
    for (var i = 1; i < numeroCasillas; i++) {
        for (var j = 1; j < numeroCasillas; j++) {
            divCasilla.classList.add("casilla");
            divCasilla.classList.add(tipoCasilla.CARRETERA);


            if (isAutovia(i, j)) {
                if (isEdificio()) {
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

function isAutovia(i, j) {
    return i % 6 !== 0 && j % 6 !== 0;
}

function isEdificio() {
    let numero = Math.random() * 100 + 1;
    if (numero > 60) {
        return true;
    } else {
        return false;
    }
}

function cuantosEdificosPorCasilla(mapTablero) {
    for (var columna = 1; columna < numeroCasillas; columna++) {
        for (var fila = 1; fila < numeroCasillas; fila++) {
            coordenada = columna + "-" + fila;
            mapTablero.get(coordenada);

            //variable necesarias 
            // let arriba = fila !== 1 ? columna + "-" + (fila - 1) : undefined;
            // let arribaDerecha = fila !== 1 && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila - 1) : undefined;
            // let derecha = columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + fila : undefined;
            // let abajoDerecha = fila !== (numeroCasillas - 1) && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila + 1) : undefined;
            // let abajo = fila !== (numeroCasillas - 1) ? columna + "-" + (fila + 1) : undefined;
            // let abajoIzquierda = fila !== (numeroCasillas - 1) && columna !== 1 ? (columna - 1) + "-" + (fila + 1) : undefined;
            // let izquierda = columna !== 1 ? (columna - 1) + "-" + fila : undefined;
            // let arribaIzquierda = fila !== 1 && columna !== 1 ? (columna + 1) + "-" + (fila + 1) : undefined;

            let CordenadasVecinas = cordenadasVencinasByCordenada(columna, fila);
            /**
             *  |13-13|14-13|15-13|
             *  |13-14|14-14|15-14|
             *  |13-15|14-15|15-15|
             */

        }
    }
}

function cordenadasVencinasByCordenada(columna, fila) {

    return {
        arriba: fila !== 1 ? columna + "-" + (fila - 1) : undefined,
        arribaDerecha: fila !== 1 && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila - 1) : undefined,
        derecha: columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + fila : undefined,
        abajoDerecha: fila !== (numeroCasillas - 1) && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila + 1) : undefined,
        abajo: fila !== (numeroCasillas - 1) ? columna + "-" + (fila + 1) : undefined,
        abajoIzquierda: fila !== (numeroCasillas - 1) && columna !== 1 ? (columna - 1) + "-" + (fila + 1) : undefined,
        izquierda: columna !== 1 ? (columna - 1) + "-" + fila : undefined,
        arribaIzquierda: fila !== 1 && columna !== 1 ? (columna + 1) + "-" + (fila + 1) : undefined,
        allVecinas: [],
    }
}


function buscarCarreterasInvalidas(mapTablero) {
    for (var columna = 0; columna < numeroCasillas - 1; columna++) {
        for (var fila = 0; fila < numeroCasillas - 1; fila++) {
            let casilla = mapTablero.get(columna + "-" + fila);
            if (casilla.classList.contains(tipoCasilla.CARRETERA)) {
                let casillasVecinas = [];
                let izquierda = columna - 1 + "-" + fila;
                let arriba = columna + "-" + fila - 1;
                let derecha = columna + 1 + "-" + fila;
                let abajo = columna + "-" + fila + 1;
                if (columna === 0 && fila === 0) {
                    casillasVecinas.pop(mapTablero.get(derecha));
                    casillasVecinas.pop(mapTablero.get(abajo));
                } else if (columna === numeroCasillas - 1 && fila === numeroCasillas - 1) {
                    casillasVecinas.pop(mapTablero.get(izquierda));
                    casillasVecinas.pop(mapTablero.get(arriba));
                } else if (columna === 0 && fila === numeroCasillas - 1) {
                    casillasVecinas.pop(mapTablero.get(derecha));
                    casillasVecinas.pop(mapTablero.get(arriba));
                } else if (columna === numeroCasillas - 1 && fila === 0) {
                    casillasVecinas.pop(mapTablero.get(izquierda));
                    casillasVecinas.pop(mapTablero.get(abajo));
                }

                casillasVecinas.map(function(c) {
                    c.classList.add("noValida");
                });
            }



        }
    }
}

function elementCasillasToMap(mapTablero) {

    var casillas = document.getElementsByClassName("casilla");
    var columna = 1;
    var fila = 1;
    for (let casilla of casillas) {
        casilla.textContent = columna + "-" + fila;
        mapTablero.set(columna + "-" + fila, casilla);
        columna++;

        if (columna % (numeroCasillas) === 0) {
            columna = 1;
            fila++;
        }
    }
    console.log(mapTablero);

}

start();