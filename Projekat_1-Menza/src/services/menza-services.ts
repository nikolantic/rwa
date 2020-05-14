import Menza from "../models/menza";
import { fromEvent,of, merge, Observable,concat} from "rxjs";
import { debounceTime, map, switchMap,take, takeUntil, reduce,filter} from "rxjs/operators";
import {getUserInformation,takeInputValue,formatWords} from "./korisnici-services";
import Korisnici from "../models/korisnici";




export function drawListOfMenza(div:HTMLUListElement){

    const tmp1=of(getMenzaObject(1));
    const tmp2=of(getMenzaObject(2));
    const tmp3=of(getMenzaObject(3));
    merge(tmp1,tmp2,tmp3).subscribe((x)=>x.then((resolve)=>resolve.drawMenza(div)))
    
}



async function getMenzaObject(id:number){

    const menza=await fetch("http://localhost:3000/menza/"+id).then((promise)=>promise.json());
    
    return new Menza(menza["id"],menza["ime"]);
}

export function addEventToMenzaInput(inputID:HTMLInputElement,paragraph:HTMLUListElement){

    fromEvent(inputID,'input').pipe(
        debounceTime(1000),
        map(()=>getInputValue(inputID)),
        switchMap((id)=>getMenuObject(id)),
        take(1)
    ).subscribe(menu=>drawMenzaMeni(menu,paragraph));

}
function getInputValue(inputId:HTMLInputElement){

    return parseInt(inputId.value);

  }

async function getMenuObject(id:Number){

    const menu=await fetch("http://localhost:3000/meni"+"?idMenze="+id).then((promise)=>promise.json());

    return menu;
}

function drawMenzaMeni(meni:Array<any>,host:HTMLUListElement){

    meni.forEach(el=>{
        let listMeni = document.createElement("li");
        listMeni.innerHTML = el["jelo"];
        host.appendChild(listMeni);
    })
    
}

export function addEvents(indeksInput:HTMLInputElement,paragraph:HTMLDivElement,btn:HTMLButtonElement,jeloInput:HTMLInputElement){
        
        const obsIndeksInput=fromEvent(indeksInput,'input').pipe(
            
            debounceTime(1000),
            map(()=>takeInputValue(indeksInput)),
            switchMap((indeks)=>getUserInformation(indeks))

            
        ).subscribe((user)=>user.drawUserBons(paragraph));


        const obs=fromEvent(jeloInput,'input').pipe(
            debounceTime(1000),
            map(()=>takeInputValue(indeksInput)),
            switchMap(indeks=>getBon(indeks))
        );
        
        const checkBon=obs.pipe(filter(val=>val<1));
        
        const obsBtnKupi=fromEvent(btn,'click').pipe(
            
            map(()=>getInput(jeloInput)),
            switchMap((jelo)=>updateBaseAndJelo(jelo)),
            takeUntil(checkBon)
            
        ).subscribe(imeJela=>drawAndUpdate(imeJela,jeloInput,indeksInput));
              
}

function getInput(input:HTMLInputElement){
    return input.value;
}

function updateBaseAndJelo(jelo:string){

   

    const nameOfJelo=formatWords(jelo);
    return getMenuFromBase(nameOfJelo);
    
}
async function getMenuFromBase(name:string){
  
    const menu=await fetch('http://localhost:3000/meni' +"?jelo=" + name );
    const menuArray= await menu.json();
   
    if (menuArray.length===0){
      alert("Unesite dostupno jelo!");
      return ""
    }
    
      const menuJson=menuArray[0];
      return menuJson["jelo"];
}

function getBon(indeks:number){

    const userObejct=getUserInformation(indeks);
    
    const userBons=userObejct.then((resolve)=>{return resolve.uplaceno})
    console.log(userBons);
    return userBons;
}
        
function  updateBon(indeks:number)
{
    const userObejct=getUserInformation(indeks);
    
    const userBons=userObejct.then((resolve)=>{return resolve.uplaceno-1})
    updateUserBons(userObejct);
    
}

const updateUserBons = async (user: Promise<Korisnici>) => {
    
    const userObject=user.then(resolve=>{
        return resolve;
    });
   
    const settings = {
      method: 'PUT',
      body: JSON.stringify({
        ime:(await userObject).ime,
        prezime:(await userObject).prezime,
        indeks:(await userObject).indeks,
        bonovi:(await userObject).bonovi,
        uplaceno:(await userObject).uplaceno-1,
        id:(await userObject).id
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    const response = await fetch('http://localhost:3000/korisnici/'+(await userObject).id, settings)
    .then(res => res.json()).then(response=>updateBonLabel(response.uplaceno));

    
  };
  function updateBonLabel(uplaceno:number){
    (document.getElementById('bon-label')as HTMLInputElement).innerHTML="Imate: "+uplaceno+" uplacena bona.";
  }

  function drawAndUpdate(imeJela:string,jeloInput:HTMLInputElement,indeksInput:HTMLInputElement){
    
    const indeks=getInputValue(indeksInput);
    const paragraph=document.getElementById('alertUser') as HTMLDivElement;
    jeloInput.value='';


    if(imeJela!==""){
        updateBon(indeks);
        paragraph.innerHTML="Kupili ste: "+imeJela+" prijatno!";
    }
    
      
      
  }


