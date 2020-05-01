import Korisnici from "../models/korisnici";
import { fromEvent,Observable,of,zip} from "rxjs";
import { debounceTime, map, switchMap,filter,take} from "rxjs/operators";



export function addEventToButton(btn){

    fromEvent(btn,'click').pipe(
       debounceTime(1500),
        map(()=>getInputElement()),
        switchMap((data)=>formatUserInfo(data))
        
    ).subscribe((user)=>addUser(user));
    
    
}

async function getInputElement(){
/*
    const userInfo=[
        document.getElementById('ime').value,
        document.getElementById('prezime').value,
        document.getElementById('indeks').value
    ]
    clearInput();
    
   return userInfo;
     */

    const prvi=of(document.getElementById('ime').value);
    const drugi=of(document.getElementById('prezime').value);
    const treci=of(document.getElementById('indeks').value);

    const allInputsObs=zip(prvi,drugi,treci);

      const result = getValue(allInputsObs);
      console.log(result);
      clearInput();
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



function clearInput(){
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
    const korisnik=new Korisnici(user[0],user[1],user[2],90);
    
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
