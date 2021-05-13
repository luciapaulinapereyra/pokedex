// roots 
const apiRoot = "https://pokeapi.co/api/v2/";
const pageRoot = apiRoot + 'pokemon/?limit=20&offset=';
const pokemonRoot = apiRoot + 'pokemon/'
var lista;
var link = {
    next:null,
    previous:null
};

let requestData = function (url, process) {
    if (window.fetch) {
        if (!url) throw new Error("URL requerido");
        fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('la respuesta dio error');
            return response.json();
        })
        .then(data => {
            if (process instanceof Function) return process(data);
            return this;
        })
        .catch(error => {
            console.error('Hubo un problema con la operacion fetch. El error es: ', error);
        });
    } else {
        throw new Error('Use un navegador mas actualizado'); //Luego QUIZAS XMLHttpRequest
    }
}

//SECTOR CATH
function crearMenuPag() {
    requestData(pokemonRoot, processMenu);
}

let processMenu = function(data){
    const cantPokemon = data.count;
    const cantPag = Math.ceil(cantPokemon / 20);
    for (let i = 1; i <= cantPag; i++) {
        option = document.createElement("option"); //creo mi <option></option>
        option.value = i;
        option.textContent = "Page " + i;
        document.getElementById("menu").appendChild(option); //inserto mi option al select     
    }
    hacerLista(data)
}

const button = document.getElementById("dittoButton");
button.addEventListener("click", () => {
    const video = document.getElementById("video");
    const body = document.querySelector("body");
    body.classList.toggle("transparente");
    video.classList.toggle("desactivado");
    video.volume = 0.2;
    if (video.paused) {
        video.play();

    } else {
        video.pause();

    }
});

//SECTOR LETI
// la funcion seguramente se puede hacer muchísimo mejor. Ver una vez terminado lo más groso.
// falta hacer que estas funciones sean flechas asi van en corcodancia con el resto del código 
function listarPokemonDesdeSelect(numSelect) {
    let url = ""
    if (numSelect.value != 1) {
        url = pageRoot + ((numSelect.value * 20) - 20)
    } else {
        url = pageRoot + 0
    }
    requestData(url, hacerLista)
}

function hacerLista(data) {
    let pokeLista = document.getElementById("lista")
    pokeLista.innerHTML = ""
    link.next = data.next;
    link.previous = data.previous;
    lista = data.results;
    lista.forEach(pokemon => {
        let li = document.createElement("li")
        li.innerText = pokemon.name
        pokeLista.appendChild(li)
        li.addEventListener("click", showPokemon);
    });
}

//
let showPokemon = function (data){
    const linkPoke = pokemonRoot+`${this.innerText}`;
    var data = requestData(linkPoke,showDataPokemon);
}

let showDataPokemon = function(data){
    let pH = document.getElementById("habilidades");
    pH.textContent="Abilities: ";
    let hString="";
    for(let i=0;i<data.abilities.length;i++){
        let habilidad=data.abilities[i].ability.name.replace("-"," ");
        hString=hString+habilidad+" || ";
    }
    pH.textContent=pH.textContent+hString;
    //codigo para agregar la imagen
    let img=data.sprites.front_default;
    document.getElementById('imagen').src=img;
    let nombre=document.getElementById("nombre");
    nombre.innerHTML=data.name;
    let tipo=document.getElementById("tipo");
    tipo.innerHTML=data.types[0].type.name;

}

//SECTOR LULU
//VER TEMA DE LA PÁGINA 1
const ant = document.getElementById("ant");
ant.addEventListener('click', () => {
    if (link.previous){
        requestData(link.previous, hacerLista);
        var paginas= document.getElementById("menu");
        paginas.selectedIndex-= 1;
    }else{
        alert('No hay anterior :(')
    }
})

const sig = document.getElementById("sig");
sig.addEventListener('click', () => {
    if (link.next){
        requestData(link.next, hacerLista);
        paginas= document.getElementById("menu");
        paginas.selectedIndex+= 1;
    }else{
        alert('No hay siguiente :(')
    }
});

//

