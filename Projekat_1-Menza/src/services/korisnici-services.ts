import Korisnici from "../models/korisnici";
import { fromEvent,of,zip, Observable, pipe} from "rxjs";
import { debounceTime, map, switchMap,filter,take} from "rxjs/operators";



export function addEventToButton(btn:HTMLButtonElement){

    fromEvent(btn,'click').pipe(

       debounceTime(1500),
        map(()=>getInputElement()),
        switchMap((data)=>formatUserInfo(data)) 

    ).subscribe((user)=>addUser(user));
       
}

async function getInputElement(){

    const prvi=of((document.getElementById('ime') as HTMLInputElement).value);
    const drugi=of((document.getElementById('prezime') as HTMLInputElement).value);
    const treci=of((document.getElementById('indeks') as HTMLInputElement).value);

    const allInputsObs=zip(prvi,drugi,treci);

      const result = getValue(allInputsObs);
      console.log(result);
      clearLoginInput();
      return result;
}

function hasValue(value:any) {
  return value !== null && value !== undefined;
}

function getValue<Korisnici>(observable:Observable<Korisnici>):Promise<Korisnici>
{
  return observable
    .pipe(
      take(1),
      filter(hasValue), 
    )
    .toPromise();
}

function clearLoginInput(){
        (document.getElementById('ime') as HTMLInputElement).value='';
        (document.getElementById('prezime') as HTMLInputElement).value='';
        (document.getElementById('indeks') as HTMLInputElement).value='';
}

function formatUserInfo(userInfo:Promise<any>){

    console.log("ovo vraca: "+userInfo);
   
    const modifiedWords=userInfo.then((resolve)=>resolve.map((user: string)=>formatWords(user))) 
    console.log(modifiedWords);
    return modifiedWords;
}

function formatWords(user:string){

    user = user.toLowerCase();
    let allWords = user.split(" ");
    let modifiedWords = allWords.map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
     );
    let returnVal = modifiedWords.join(" ");

    return returnVal;
}

const addUser = async (user:Array<any>) => {
    console.log(user);
    
    const korisnik=new Korisnici(user[0],user[1],user[2],90,0,0);
    
    const settings = {
      method: 'POST',
      body: JSON.stringify(korisnik),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    const response = await fetch(`http://localhost:3000/korisnici`, settings)
    .then(res => res.json()).then(response=>console.log(response));
    
  };

  export function addEventToInput(inputElement:HTMLInputElement,paragraph:HTMLDivElement){
    
    const obsInput=fromEvent(inputElement,'input').pipe(
        
        debounceTime(1000),
        map(()=>takeInputValue(inputElement)),
        switchMap((index)=>getUserInformation(index)),
    ).subscribe(user=>drawUser(user,paragraph));   
  }

  export function takeInputValue(inputElement:HTMLInputElement){

    return parseInt(inputElement.value);

  }

  export function drawUser(user:any,paragraph:HTMLDivElement){
    user.drawUserInformation(paragraph);
  }

  function getIndeks(){

    const inputValue=parseInt((document.getElementById('indeks-uplati') as HTMLInputElement).value);
    return inputValue;

  }
  
  export function addEventToButtonUplati(btn:HTMLButtonElement){

    
    const obsButton = fromEvent(btn, 'click').pipe(
      take(1),
      map(()=>getIndeks()),
      switchMap((indeks)=>getUserInformation(indeks))
      
    );
    const inputBon=(<HTMLInputElement>document.getElementById('inputBon'));
    const obsInputBon=fromEvent(inputBon,'input').pipe(
      debounceTime(1000),
      map(()=>takeInputValue(inputBon))
    );

    zip(obsInputBon,obsButton).subscribe(arrayObs=>{console.log(arrayObs),updateUser(arrayObs)});

  }

  export async function getUserInformation(index:number){

    let userObject=  getUserObject(index);

    return userObject;

  }

   async function getUserObject(indeks:number){
    
    const user=await fetch('http://localhost:3000/korisnici' +"?indeks=" + indeks );
    const jsonUserArray= await user.json();
   
    if (jsonUserArray.length===0){
      return Korisnici.errorUser();
    }
      const userJson=jsonUserArray[0];
      return new Korisnici(userJson["ime"],userJson["prezime"],userJson["indeks"],userJson["bonovi"],userJson["uplaceno"],userJson["id"]);
  }

  const updateUser = async (user: Array<any>) => {
    
    const userObject=user[1];
    
    const uplacenoUpdate=parseInt(userObject.uplaceno)+parseInt(user[0]);
    const bonoviUpdate=userObject.bonovi-parseInt(user[0]);
    //ovo pokusati sa filter,reduce itd.

    const settings = {
      method: 'PUT',
      body: JSON.stringify({
        ime:userObject.ime,
        prezime:userObject.prezime,
        indeks:userObject.indeks,
        bonovi:bonoviUpdate,
        uplaceno:uplacenoUpdate,
        id:userObject.id
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    const response = await fetch('http://localhost:3000/korisnici/'+userObject.id, settings)
    .then(res => res.json()).then(response=>updateAll(response.uplaceno,response.bonovi));
    
  };

  function updateAll(x:number,y:number){

    (document.getElementById('labelaUplaceno')as HTMLInputElement).innerHTML="Uplaceno: "+x;
    (document.getElementById('labelaBonovi')as HTMLInputElement).innerHTML="Bonovi: "+y;
    (document.getElementById('inputBon') as HTMLInputElement).value="";
    (document.getElementById('indeks-uplati') as HTMLInputElement).value=""

    const modelDel=(document.getElementById('model')as HTMLInputElement);

    setTimeout(()=> modelDel.innerHTML='',2500);

   
      
  }
  

  
