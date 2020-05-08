import {addEventToButton,addEventToInput} from "./services/korisnici-services";
import {drawListOfMenza,addEventToMenzaInput,addEvents} from "./services/menza-services";

console.log("test");

const dugme=document.getElementById('btn') as HTMLButtonElement;
addEventToButton(dugme);

const input=document.getElementById('indeks-uplati') as HTMLInputElement;
const paragraf=document.getElementById('model') as HTMLDivElement;
addEventToInput(input,paragraf);

const menzaUl=document.getElementById('menza-ul')as HTMLUListElement;
drawListOfMenza(menzaUl);

const menzaInputID=document.getElementById('menza-id') as HTMLInputElement;
const meniUl=document.getElementById('meni-ul')as HTMLUListElement;
addEventToMenzaInput(menzaInputID,meniUl);


const idOfInputStanje=document.getElementById('indeks-stanje') as HTMLInputElement;
const idOfDivStanje=document.getElementById('stanje') as HTMLDivElement;
const idOfBtnKupi=document.getElementById('kupiBtn') as HTMLButtonElement;
const idOfJeloInput=document.getElementById('inputJelo-id') as HTMLInputElement;
addEvents(idOfInputStanje,idOfDivStanje,idOfBtnKupi,idOfJeloInput);





