import Korisnici from "../models/korisnici";
import { fromEvent,of,zip} from "rxjs";
import { debounceTime, map, switchMap,filter,take} from "rxjs/operators";



export function addEventToButton(btn){

    fromEvent(btn,'click').pipe(
       debounceTime(1500),
        map(()=>getInputElement()),
        switchMap((data)=>formatUserInfo(data))
        
    ).subscribe((user)=>addUser(user));
    
    
}

async function getInputElement(){

    const prvi=of(document.getElementById('ime').value);
    const drugi=of(document.getElementById('prezime').value);
    const treci=of(document.getElementById('indeks').value);

    const allInputsObs=zip(prvi,drugi,treci);

      const result = getValue(allInputsObs);
      console.log(result);
      clearLoginInput();
      return result;
}

function hasValue(value) {
  return value !== null && value !== undefined;
}

function getValue(observable){
  return observable
    .pipe(
      filter(hasValue), 
    )
    .toPromise();
}

function clearLoginInput(){
        document.getElementById('ime').value='';
        document.getElementById('prezime').value='';
        document.getElementById('indeks').value='';
}

function formatUserInfo(userInfo){

    console.log("ovo vraca: "+userInfo);
   
    const modifiedWords=userInfo.then((resolve)=>resolve.map((user)=>formatWords(user))) 
    console.log(modifiedWords);
    return modifiedWords;
}

function formatWords(user){

    user = user.toLowerCase();
    let allWords = user.split(" ");
    let modifiedWords = allWords.map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
     );
    let returnVal = modifiedWords.join(" ");

    return returnVal;
}

const addUser = async (user) => {
    console.log(user+"OVO JE u sub");
    const korisnik=new Korisnici(user[0],user[1],user[2],90,0);
    
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

  export function addEventToInput(inputElement,paragraph){
    
    const obsInput=fromEvent(inputElement,'input').pipe(
        
        debounceTime(1000),
        map((ev)=>ev.target.value),
        switchMap((index)=>getUserInformation(index)),

    ).subscribe(x=>x.drawUserInformation(paragraph));
      
  }

  function getIndeks(){

    const inputValue=document.getElementById('indeks-uplati').value;
    
    

    return inputValue;

  }
  
  export function addEventToButtonUplati(btn){
    
    const obsButton = fromEvent(btn, 'click').pipe(
      map(()=>getIndeks()),
      switchMap((indeks)=>getUserInformation(indeks))  
    );
    const obsInputBon=fromEvent(document.getElementById('inputBon'),'input').pipe(
      debounceTime(1000),
      map((ev)=>ev.target.value)
    );

    zip(obsInputBon,obsButton).subscribe(arrayObs=>{console.log(arrayObs),updateUser(arrayObs)});

  }

  async function getUserInformation(index){

    let userObject= await getUserObject(index);

    return userObject;

  }

  async function getUserObject(indeks){
    
    const user=await fetch('http://localhost:3000/korisnici' +"?indeks=" + indeks );
    const jsonUserArray= await user.json();
   
    if (jsonUserArray.length===0){
      return Korisnici.errorUser();
    }
      const userJson=jsonUserArray[0];
      return new Korisnici(userJson["ime"],userJson["prezime"],userJson["indeks"],userJson["bonovi"],userJson["uplaceno"],userJson["id"]);
  }

  const updateUser = async (user) => {
    
    const userObject=user[1];
    
    const tmp=parseInt(userObject.uplaceno)+parseInt(user[0]);

    console.log(tmp);
    const settings = {
      method: 'PUT',
      body: JSON.stringify({
        ime:userObject.ime,
        prezime:userObject.prezime,
        indeks:userObject.indeks,
        bonovi:userObject.bonovi,
        uplaceno:tmp,
        id:userObject.id
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    const response = await fetch('http://localhost:3000/korisnici/'+userObject.id, settings)
    .then(res => res.json()).then(response=>updateUplacenoLabel(response.uplaceno));
    
  };

  function updateUplacenoLabel(x){
    document.getElementById('labelaUplaceno').innerHTML="Uplaceno: "+x;
    document.getElementById('inputBon').value="";
  }

  
