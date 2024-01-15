// Desarrollador: Mauricio Almuna.
// Aplicacion: Sistema para estados de maquinaria.
// Fecha: 15-01-2024.


// Almacena el endpoint de la Api.
const apiUrl = `https://wrk.acronex.com/api/challenge/machines?q=`;


// Datos globales requeridos para las funciones filtrarCards() y ejecutaCard();
let card = document.getElementById("card-element");
let input = document.getElementById('search');


// Descripcion: Procesa la logica del search.
async function filtraCards() {    
    try {       
        let valorSearch = input.value.toLowerCase();
        const response = await fetch(apiUrl);
        const datos = await response.json();  
        card.innerHTML = "";
        
        datos.forEach(element => {
            //Include lo usamos para encontrar el valor dentro de la cadena.
            if (element.description.toLowerCase().includes(valorSearch)) {
                card.innerHTML += `
                    <div class="col-9 custom-card d-flex align-items-center" onclick="abreFicha(${element.id}); clickCardOn();">
                        <div class="col-1 ps-2">
                            <p class="m-0 txt-id" id="id-texto">(${element.id})</p>
                        </div>
                        <div class="col-10">
                            <p class="m-0 txt-descripcion" id="parrafo">${element.description}</p>
                        </div>
                        <div class="col-1 d-flex justify-content-center">
                            <div class="${cambioEstado(element.working)}"></div>
                        </div>
                    </div>
                `;
            }
        });
            
        if(valorSearch !== ''){
            clickCardOff();
        }
        
    } catch (error) {
        console.error(error);
    }
}


// Funcion que obtiene los datos de la ficha "informacion de maquina".
async function abreFicha(id) {
    try {
    
        const apiUrlId = `https://wrk.acronex.com/api/challenge/machines?q=${id}`;
        const response = await fetch(apiUrlId);
        
        // datos generales ficha
        const fichaHead = document.getElementById('head-ficha');
        const dataEmpresa = document.getElementById('datos-empresa');
        const dataClase = document.getElementById('datos-clase');
        const dataFecha = document.getElementById('datos-fecha');
        const dataEstado = document.getElementById('datos-estado');
        
        // indicadores
        const dataIndicador = document.getElementById('padre-indicador');
        

        // tablas de datos
        const dataGeneral = document.getElementById('id-general');
        const dataClima = document.getElementById('id-clima');
        const dataOperacion = document.getElementById('id-operacion');
        
        const data = await response.json();
    
        for (let i in data){
                
            fichaHead.innerHTML = '';
            fichaHead.innerHTML += `
                <p class="m-0 fs-5">${data.description}</p>
                <p class="m-0 fs-5 color-id">${data.id}</p>
            `;
            
            dataEmpresa.innerHTML = '';
            dataEmpresa.innerHTML +=`
                <p class="m-0 fw-bolder">Empresa</p>
                <p class="m-0 color-empresa">${data.company}</p>
            `;
            
            dataClase.innerHTML = '';
            dataClase.innerHTML +=`
                <p class="m-0 fw-bolder">Clase</p>
                <p class="m-0">${data.class}</p>

            `;

            dataFecha.innerHTML = '';
            dataFecha.innerHTML = `
                <p class="m-0 fw-bolder">Ultima actualizacion</p>
                <p class="m-0">${data.last_update}</p>
            `;
            
            dataEstado.innerHTML = '';
            dataEstado.innerHTML = `
                <div class="${colorEstado(data.working)} me-2"></div>
                <p class="m-0">${estadoMaquina(data.working)}</p>
            `;
            
            //Trae los valores de la Api para imprimir los INDICADORES.
            dataIndicador.innerHTML = '';
            dataIndicador.innerHTML = `
                <div class="indicador border ${colorIndicador(data.last["it"])} p-3" id="id-it">
                    <p class="m-0 text-center txt-indicador">${data.data_description.headers["it"].n}</p>
                    <p class="m-0 text-center fs-4">${calcularCalidad(data.last["it"]) + '' + data.data_description.headers["it"].u}</p>
                </div>
                <div class="indicador border ${colorIndicador(data.last["ie"])} p-3" id="id-ie">
                    <p class="m-0 text-center txt-indicador">${data.data_description.headers["ie"].n}</p>
                    <p class="m-0 text-center fs-4">${calcularCalidad(data.last["ie"]) + '' + data.data_description.headers["ie"].u}</p>
                </div>
                <div class="indicador border ${colorIndicador(data.last["id"])} p-3" id="id-id">
                    <p class="m-0 text-center txt-indicador">Perdida p. viento</p>
                    <p class="m-0 text-center fs-4">${calcularCalidad(data.last["id"]) + '' + data.data_description.headers["id"].u}</p>
                </div>
                <div class="indicador border ${colorIndicador(data.last["ig"])} p-3" id="id-ig">
                    <p class="m-0 text-center txt-indicador">Calidad</p>
                    <p class="m-0 text-center fs-4">${calcularCalidad(data.last["ig"]) + '' + data.data_description.headers["ig"].u}</p>
                </div>
                
            `;

            dataGeneral.innerHTML = '';
            dataGeneral.innerHTML = `
                <p class="m-0 fs-6">indefinido</p>
                <p class="m-0 fs-6">${data.last[19] +' '+data.data_description.headers["19"].u}</p>
                <p class="m-0 fs-6">${data.last[20] +' '+data.data_description.headers["20"].u}</p>
                <p class="m-0 fs-6">indefinido</p>
            `;

            dataClima.innerHTML = '';
            dataClima.innerHTML = `
                <p class="m-0 fs-6">${data.last[200] +' '+data.data_description.headers["200"].u}</p>
                <p class="m-0 fs-6">${data.last[201] +' '+data.data_description.headers["201"].u}</p>
                <p class="m-0 fs-6">${data.last[203] +' '+data.data_description.headers["203"].u}</p>
                <p class="m-0 fs-6">${data.last[204] +' '+data.data_description.headers["204"].u}</p>
            `;

            dataOperacion.innerHTML = '';
            dataOperacion.innerHTML = `
                <p class="m-0 fs-6">${data.last[25] +' '+data.data_description.headers["25"].u}</p>
                <p class="m-0 fs-6">${data.last[202] +' '+data.data_description.headers["202"].u}</p>
                <p class="m-0 fs-6">${data.last[281] +' '+data.data_description.headers["281"].u}</p>
                <p class="m-0 fs-6">${data.last[393] +' '+data.data_description.headers["393"].u}</p>
            `;
            
        }          
         
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
     
    clickCardOn();
    input.value = '';    
}

// Descripcion: Retorna la clase con el color del punto de quiebre establecido. 
function colorIndicador(calidad){
    formula = (1 - calidad) * 100;

    if((formula <= 100) && (formula > 50)){
        return 'bg-100';
    }else if((formula <= 50) && (formula > 35)){
        return 'bg-50';
    }else if((formula <= 35) && (formula > 20)){
        return 'bg-35';
    }else if((formula <= 20) && (formula > 10)){
        return 'bg-20';
    }else if((formula <= 10) && (formula > 0)){
        return 'bg-10';
    }else if(formula === 0){
        return 'bg-0';
    }else{
        return 'bg-default';
    }


}

// Descripcion: cambia el color del circulo de estado en la vista "listado de maquinas".
function cambioEstado(valor){  
    if (valor === true){
        let estado = 'circle-state-green';
        return estado;
    }else{
        let estado = 'circle-state-red';
        return estado;
    }
   
}

// Descripcion: Oculta la vista que contiene el "informacion de maquina" y muestra la vista "listado de maquinas".
function clickCardOn(){
    seccionDetalle = document.getElementById('detalle');
    seccionTarjetas = document.getElementById('card-element');
    seccionDetalle.classList.remove('d-none');
    seccionTarjetas.classList.add('d-none');

}

// Descripcion: Oculta la vista que contiene el "listado de maquinas" y muestra la vista "informacion de maquina". 
function clickCardOff(){
    seccionDetalle = document.getElementById('detalle');
    seccionTarjetas = document.getElementById('card-element');
    seccionDetalle.classList.add('d-none');
    seccionTarjetas.classList.remove('d-none');
    
}

// Descripcion: imprime el estado en el que se encuentra la maquina. 
function estadoMaquina(estado){
    if(estado === true){
        let textoEstado = 'En movimiento';
        return textoEstado;
    }else{
        let textoEstado = 'Detenida';
        return textoEstado;
    }
    
}

// Descripcion: retorna el nombre de dos clases que pintan el circulo estado. 
function colorEstado(colorEstado){
    if(colorEstado === true){
        let claseColor ='circulo-estado-activo';
        return claseColor;
    }else{
        let claseColor ='circulo-estado-inactivo';
        return claseColor;
    }

}

// Descripcion: Calcula la calidad de los indicadores obteniendo los datos de la API y muestra su valor. 
function calcularCalidad(valor){
    let resultado = (1 - valor) * 100;    
    return resultado;

}

// Descripcion: muestra las card por defecto en la vista "Listado de maquinas". 
async function ejecutaCard(){    
    const resp = await fetch(apiUrl);
    const data = await resp.json();

    card.innerHTML = "";
    data.forEach(e => {
        card.innerHTML += `
            <div class="col-9 custom-card d-flex align-items-center" onclick="abreFicha(${e.id}); clickCardOn();">
                <div class="col-1 ps-2">
                    <p class="m-0 txt-id" id="id-texto">(${e.id})</p>
                </div>
                <div class="col-10">
                    <p class="m-0 txt-descripcion" id="parrafo">${e.description}</p>
                </div>
                <div class="col-1 d-flex justify-content-center">
                    <div class="${cambioEstado(e.working)}"></div>
                </div>
            </div>
        `;         
    });

}

// Descripcion: ejecuta la funcion para traer la vista de card por defecto.
ejecutaCard();
