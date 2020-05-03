import {addEventToButton,addEventToInput} from "./services/korisnici-services";

console.log("test");

const dugme=document.getElementById('btn');
addEventToButton(dugme);

const input=document.getElementById('indeks-uplati');
const paragraf=document.getElementById('model');
addEventToInput(input,paragraf);

