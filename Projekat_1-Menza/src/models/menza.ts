export default class Menza{

    id:number; ime:string;
    constructor(id:number,ime:string){
        this.id=id;
        this.ime=ime;
    }

    drawMenza(host:HTMLUListElement) {
        let listItem = document.createElement("li");
		listItem.innerHTML = "Studentski restoran kod: "+this.ime+"</br>"+" ID restorana je: "+this.id;
		host.appendChild(listItem);
    }

        
    

}

