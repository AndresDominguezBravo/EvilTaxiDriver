const numeroCasillas = 20;
const unidadCasillasMetros = 100;
let mapTablero = new Map();
let Marcadores = {
    dinero: 0,
    numClientes: 0,
    distancia: 0,
}
let ultimoMovimiento = "";
let intervalo = 0;

function start(isPrimeraRonda) {
    if (isPrimeraRonda) {
        document.getElementsByClassName("menuPrincipal")[0].remove();
        document.getElementsByClassName("score")[0].style.display = 'block';
        document.getElementById("controles").style.display = 'inline-block';
    } else {
        document.getElementsByClassName("tablero")[0].innerHTML = "";
    }
    generarMundoDisplay();
    elementCasillasToMap();
    generarEdificosPorCasilla(tipoGeneracionCasilla.CLIENTE_MAS_TAXI, false);
    generarClienteMasTaxi();
    generarEventoCasilla();
    generarEventoTeclado();
    document.getElementById("MarcadorDinero").textContent = Marcadores.dinero;
    document.getElementById("MarcadorClientes").textContent = Marcadores.numClientes;
    document.getElementById("MarcadorTiempo").textContent = nuevaCuentaAtras();
}

const tipoCasilla = {
    CARRETERA: "carretera",
    EDIFICIO: "edificio",
    RUTA: "ruta",
    CLIENTE: "cliente",
    CARRETERA_VALIDA: "carreteraValida",
    TAXI: "taxi"
}

const tipoGeneracionCasilla = {
    CLIENTE_MAS_TAXI: 1,
    EDIFICIOS: 2
}


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
                    divCasilla.classList.remove(tipoCasilla.CARRETERA);
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
    return i % 5 !== 0 && j % 5 !== 0;
}

function isEdificio() {
    let numero = Math.random() * 100 + 1;
    if (numero > 95) {
        return true;
    } else {
        return false;
    }
}

function generarEdificosPorCasilla(tipoGeneracionCasilla, modoLog) {
    for (var columna = 1; columna < numeroCasillas; columna++) {
        for (var fila = 1; fila < numeroCasillas; fila++) {
            coordenada = columna + "-" + fila;
            coordenada = mapTablero.get(coordenada);

            /**
             *  |13-13|14-13|15-13|
             *  |13-14|14-14|15-14|
             *  |13-15|14-15|15-15|
             */
            let CordenadasVecinas = cordenadasVencinasByCordenada(columna, fila);
            let CordenadasConectadas = cordenadasConectadasByCordenada(columna, fila);
            let elementoDomCasilla = undefined;
            let contadorEdificios = 0;
            let contadorEdificiosConectados = 0;
            CordenadasVecinas.allVecinas.forEach(c => {
                if (c !== undefined) {
                    elementoDomCasilla = mapTablero.get(c);
                    if (elementoDomCasilla.classList.contains(tipoCasilla.EDIFICIO)) {
                        contadorEdificios++;
                    }
                } else {
                    contadorEdificios++;
                }

            });
            CordenadasConectadas.allConectadas.forEach(c => {
                if (c !== undefined) {
                    elementoDomCasilla = mapTablero.get(c);
                    if (elementoDomCasilla.classList.contains(tipoCasilla.EDIFICIO)) {
                        contadorEdificiosConectados++;
                    }
                } else {
                    contadorEdificiosConectados++;
                }

            });

            //modo desarrollador
            if (modoLog) {
                if (contadorEdificios <= 3) {
                    if (coordenada.classList.contains(tipoCasilla.CARRETERA)) {
                        coordenada.textContent = contadorEdificios + "-" + contadorEdificiosConectados;
                        coordenada.classList.add("numEdificio-" + contadorEdificios);
                    }
                }
            }

            switch (tipoGeneracionCasilla) {
                case 2:
                    if (coordenada.classList.contains(tipoCasilla.CARRETERA)) {
                        if (contadorEdificios <= 1) {
                            coordenada.classList.add(tipoCasilla.EDIFICIO);
                            coordenada.classList.remove(tipoCasilla.CARRETERA);
                        }
                    }
                    break;
                case 1:
                    if (contadorEdificios <= 3) {
                        if (coordenada.classList.contains(tipoCasilla.CARRETERA)) {
                            coordenada.classList.add(tipoCasilla.CARRETERA_VALIDA);
                        }
                    }
                    break;
            }
        }
    }
}

function generarClienteMasTaxi() {
    let listadoCarretas = document.getElementsByClassName(tipoCasilla.CARRETERA_VALIDA);
    listadoCarretas[0].classList.add(tipoCasilla.CLIENTE);
    listadoCarretas[listadoCarretas.length - 1].classList.add(tipoCasilla.TAXI);

}

function generarEventoCasilla() {
    let listadoCarretas = Array.prototype.slice.call(document.getElementsByClassName(tipoCasilla.CARRETERA));
    listadoCarretas.forEach(element => {
        element.addEventListener("mouseover", añadirEvento);
        //element.addEventListener("touchmove", añadirEvento);
    });


}

function generarEventoTeclado() {

    document.addEventListener("keydown", leerTecla, false);
    //document.addEventListener("keyup", keyUpHandler, false);

    function leerTecla(e) {
        let movimiento;
        if (e.keyCode == 40 || e.keyCode == 83) {
            movimiento = "abajo";
        } else if (e.keyCode == 39 || e.keyCode == 68) {
            movimiento = "derecha";
        } else if (e.keyCode == 38 || e.keyCode == 87) {
            movimiento = "arriba";
        } else if (e.keyCode == 37 || e.keyCode == 65) {
            movimiento = "izquierda";
        }

        movimientoPerpetuoTaxi(movimiento);
    }

}

function movimientoPerpetuoTaxi(movimiento) {

    if (ultimoMovimiento !== movimiento) {
        moverTaxi(movimiento);
        if (intervalo <= 1) {
            intervalo = setInterval(moverTaxi, 200, movimiento);
        }
    }


}

function moverTaxi(movimiento) {

    let auxTaxi = document.getElementsByClassName("taxi")[0];

    let datosTaxi = cordenadasConectadasByCordenada(auxTaxi.dataColumna, auxTaxi.dataFila);

    switch (movimiento) {
        case "arriba":
            logicaMoverTaxi(datosTaxi.arriba, auxTaxi);
            break;
        case "abajo":
            logicaMoverTaxi(datosTaxi.abajo, auxTaxi);
            break;
        case "derecha":
            logicaMoverTaxi(datosTaxi.derecha, auxTaxi);
            break;
        case "izquierda":
            logicaMoverTaxi(datosTaxi.izquierda, auxTaxi);
            break;
    }

    ultimoMovimiento = movimiento;
}

function logicaMoverTaxi(nextCoordenadas, auxTaxi) {
    if (isMovimientoValido(mapTablero.get(nextCoordenadas))) {
        if (!mapTablero.get(nextCoordenadas).classList.contains(tipoCasilla.CLIENTE)) {
            mapTablero.get(nextCoordenadas).classList.add(tipoCasilla.TAXI);
            auxTaxi.classList.remove(tipoCasilla.TAXI);
            auxTaxi.classList.add(tipoCasilla.RUTA);
        } else {
            cargarNuevaRonda();
        }
    }
}

function isMovimientoValido(nextCoordenadas) {
    if (nextCoordenadas != undefined) {
        if (!nextCoordenadas.classList.contains(tipoCasilla.EDIFICIO)) {
            return true;
        }
    } else {
        clearInterval(intervalo);
        return false;
    }
}

function añadirEvento(e) {
    clearInterval(intervalo);
    element = e.target;
    if (element.classList.contains(tipoCasilla.CARRETERA)) {
        let CordenadasConectadas = cordenadasConectadasByCordenada(element.dataColumna, element.dataFila);
        let isRutaOTaxi = false;
        CordenadasConectadas.allConectadas.forEach(c => {
            let casilla = mapTablero.get(c);
            if (c !== undefined) {
                if (casilla.classList.contains(tipoCasilla.TAXI)) {
                    isRutaOTaxi = true;
                    casilla.classList.remove(tipoCasilla.TAXI);
                    casilla.classList.add(tipoCasilla.RUTA);
                }
            }

        });
        if (isRutaOTaxi) {
            if (element.classList.contains(tipoCasilla.CLIENTE)) {
                cargarNuevaRonda();
            }
            element.classList.add(tipoCasilla.TAXI);
        }

    }


}

function cargarNuevaRonda() {
    clearInterval(intervalo);
    let distancia = document.getElementsByClassName(tipoCasilla.RUTA).length * unidadCasillasMetros;
    Marcadores.distancia += distancia * unidadCasillasMetros;
    Marcadores.numClientes = ++Marcadores.numClientes;
    Marcadores.dinero = Marcadores.dinero + Math.floor(distancia * 0.002);
    document.getElementById("MarcadorDinero").textContent = Marcadores.dinero;
    document.getElementById("MarcadorClientes").textContent = Marcadores.numClientes;
    document.getElementById("MarcadorTiempo").textContent = nuevaCuentaAtras();
    console.log(Marcadores);
    start(false);
}

function nuevaCuentaAtras() {
    return 60;
}

function cordenadasVencinasByCordenada(columna, fila) {

    let CoordenadasVecinas = {
        arriba: fila !== 1 ? columna + "-" + (fila - 1) : undefined,
        arribaDerecha: fila !== 1 && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila - 1) : undefined,
        derecha: columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + fila : undefined,
        abajoDerecha: fila !== (numeroCasillas - 1) && columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + (fila + 1) : undefined,
        abajo: fila !== (numeroCasillas - 1) ? columna + "-" + (fila + 1) : undefined,
        abajoIzquierda: fila !== (numeroCasillas - 1) && columna !== 1 ? (columna - 1) + "-" + (fila + 1) : undefined,
        izquierda: columna !== 1 ? (columna - 1) + "-" + fila : undefined,
        arribaIzquierda: fila !== 1 && columna !== 1 ? (columna - 1) + "-" + (fila - 1) : undefined,
        allVecinas: [],
    }
    CoordenadasVecinas.allVecinas = [CoordenadasVecinas.arriba,
        CoordenadasVecinas.arribaDerecha,
        CoordenadasVecinas.derecha,
        CoordenadasVecinas.abajoDerecha,
        CoordenadasVecinas.abajo,
        CoordenadasVecinas.abajoIzquierda,
        CoordenadasVecinas.izquierda,
        CoordenadasVecinas.arribaIzquierda
    ]
    return CoordenadasVecinas;
}

function cordenadasConectadasByCordenada(columna, fila) {

    let CoordenadasConectadas = {
        arriba: fila !== 1 ? columna + "-" + (fila - 1) : undefined,
        derecha: columna !== (numeroCasillas - 1) ? (columna + 1) + "-" + fila : undefined,
        abajo: fila !== (numeroCasillas - 1) ? columna + "-" + (fila + 1) : undefined,
        izquierda: columna !== 1 ? (columna - 1) + "-" + fila : undefined,
        allConectadas: [],
    }
    CoordenadasConectadas.allConectadas = [CoordenadasConectadas.arriba,
        CoordenadasConectadas.derecha,
        CoordenadasConectadas.abajo,
        CoordenadasConectadas.izquierda,
    ]
    return CoordenadasConectadas;
}

function elementCasillasToMap() {

    var casillas = document.getElementsByClassName("casilla");
    var columna = 1;
    var fila = 1;
    for (let casilla of casillas) {
        casilla.dataColumna = columna;
        casilla.dataFila = fila;
        mapTablero.set(columna + "-" + fila, casilla);
        columna++;

        if (columna % (numeroCasillas) === 0) {
            columna = 1;
            fila++;
        }
    }
    console.log(mapTablero);
    generarEdificosPorCasilla(tipoGeneracionCasilla.EDIFICIOS, false);
}