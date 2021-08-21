const numeroCasillas = 20;
const unidadCasillasMetros = 100;
let mapTablero = new Map();
let Marcadores = {
    dinero: 0,
    numClientes: 0,
    distancia:0,
}

function start() {
    document.getElementsByClassName("menuPrincipal")[0].remove();
    generarMundoDisplay();
    elementCasillasToMap();
    generarEdificosPorCasilla(tipoGeneracionCasilla.CLIENTE_MAS_TAXI,false);
    generarClienteMasTaxi();
    generarEventoCasilla();
}
function nextLevel() {
    document.getElementsByClassName("tablero")[0].innerHTML= "";
 
    generarMundoDisplay();
    elementCasillasToMap();
    generarEdificosPorCasilla(tipoGeneracionCasilla.CLIENTE_MAS_TAXI,false);
    generarClienteMasTaxi();
    generarEventoCasilla();
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
    CLIENTE_MAS_TAXI:1,
    EDIFICIOS:2
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

function generarEdificosPorCasilla(tipoGeneracionCasilla,modoLog) {
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
                if(c!==undefined){
                    elementoDomCasilla = mapTablero.get(c);
                    if(elementoDomCasilla.classList.contains(tipoCasilla.EDIFICIO)){
                        contadorEdificios++;
                    }
                }else{
                    contadorEdificios++;
                }

            });
            CordenadasConectadas.allConectadas.forEach(c => {
                if(c!==undefined){
                    elementoDomCasilla = mapTablero.get(c);
                    if(elementoDomCasilla.classList.contains(tipoCasilla.EDIFICIO)){
                        contadorEdificiosConectados++;
                    }
                }else{
                    contadorEdificiosConectados++;
                }

            });

            //modo desarrollador
            if(modoLog){
                if(contadorEdificios <=3){
                    if(coordenada.classList.contains(tipoCasilla.CARRETERA)){ 
                        coordenada.textContent = contadorEdificios +"-"+ contadorEdificiosConectados;
                        coordenada.classList.add("numEdificio-"+contadorEdificios);
                    }
                }
            }
            
            switch(tipoGeneracionCasilla){
                case 2:
                    if(coordenada.classList.contains(tipoCasilla.CARRETERA)){               
                        if(contadorEdificios <= 1){
                            coordenada.classList.add(tipoCasilla.EDIFICIO);
                            coordenada.classList.remove(tipoCasilla.CARRETERA);
                        }               
                    }
                    break;
                case 1:
                    if(contadorEdificios <=3){
                        if(coordenada.classList.contains(tipoCasilla.CARRETERA)){                             
                           coordenada.classList.add(tipoCasilla.CARRETERA_VALIDA);
                        }
                    }
                    break;
            }          
        }
    }
}

function generarClienteMasTaxi(){
    let listadoCarretas = document.getElementsByClassName(tipoCasilla.CARRETERA_VALIDA);
    listadoCarretas[0].classList.add(tipoCasilla.CLIENTE);
    listadoCarretas[listadoCarretas.length - 1].classList.add(tipoCasilla.TAXI);

}

function generarEventoCasilla(){
    let listadoCarretas =Array.prototype.slice.call(document.getElementsByClassName(tipoCasilla.CARRETERA));
    listadoCarretas.forEach(element => {
        element.addEventListener("mouseover", añadirEvento);
        element.addEventListener("touchmove", añadirEvento);
    });


}

function añadirEvento(e){
    element = e.target;
    if(element.classList.contains(tipoCasilla.CARRETERA)){
        let CordenadasConectadas = cordenadasConectadasByCordenada(element.dataColumna, element.dataFila);
        let isRutaOTaxi = false;
        CordenadasConectadas.allConectadas.forEach(c => {
            let casilla = mapTablero.get(c);
            if(c!==undefined){
                if(casilla.classList.contains(tipoCasilla.TAXI)){
                    isRutaOTaxi = true;
                    casilla.classList.remove(tipoCasilla.TAXI);
                    casilla.classList.add(tipoCasilla.RUTA);
                }
            }

        });
        if(isRutaOTaxi){
            if(element.classList.contains(tipoCasilla.CLIENTE)){
                cargarNuevaRonda();
            }   
            element.classList.add(tipoCasilla.TAXI);
        }
        
    }
    

}

function cargarNuevaRonda(){

    Marcadores.distancia += document.getElementsByClassName(tipoCasilla.RUTA).length * unidadCasillasMetros;
    Marcadores.numClientes 
    = ++Marcadores.numClientes;
    Marcadores.dinero += Marcadores.distancia * 0.002;
    console.log(Marcadores);
    nextLevel();
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
    generarEdificosPorCasilla(tipoGeneracionCasilla.EDIFICIOS,false);
}

start();