import {addEventToButtonUplati} from "../services/korisnici-services";


 export default class Korisnici{
    ime:string; prezime:string; indeks:number; bonovi:number; uplaceno:number; id:number;
    constructor(ime:string,prezime:string,indeks:number,bonovi:number,uplaceno:number,id:number)
    {
       
        this.ime=ime;
        this.prezime=prezime;
        this.indeks=indeks;
        this.bonovi=bonovi;
        this.uplaceno=uplaceno;
        this.id=id;
    }

    static errorUser() {
		return new Korisnici("","",0,0,0,0);
    }
    
    drawUserInformation(host:HTMLDivElement){

        host.innerHTML='';
        
        if(this.ime==""){
            const label=document.createElement('label');
            label.className="labela";
            label.innerHTML="Nije pronadjen student!";
            host.appendChild(label);
        }
        else
        {
            const label=document.createElement('label');
            label.className="labela";
            label.innerHTML="Ime: "+this.ime;
            host.appendChild(label);
            const label2=document.createElement('label');
            label2.innerHTML="Prezime: "+this.prezime;
            host.appendChild(label2);
            const label3=document.createElement('label');
            label3.innerHTML="Indeks: "+this.indeks;
            host.appendChild(label3);
            const label4=document.createElement('label');
            label4.id="labelaBonovi";
            label4.innerHTML="Bonovi: "+this.bonovi;
            host.appendChild(label4);
            const label5=document.createElement('labelUplaceno');
            label5.id="labelaUplaceno"
            label5.innerHTML="Uplaceno: "+this.uplaceno;
            host.appendChild(label5);

            const div=document.createElement("div");
            div.className="rowUplati";
            host.appendChild(div);

            const inputBon=document.createElement('input');
            inputBon.id="inputBon";
            div.appendChild(inputBon);

            const dugme=document.createElement('button');
            dugme.id="buttonUplati";
            dugme.innerHTML="Uplati";
            div.appendChild(dugme);

            addEventToButtonUplati(dugme);   

        }   

    }
    getBon(){
        return this.uplaceno;
    }

    drawUserBons(host:HTMLDivElement){
        host.innerHTML='';

        const labelBon=document.createElement('label');
        labelBon.id="bon-label";
        host.appendChild(labelBon);

        if(this.ime=="") labelBon.innerHTML="Nije pronadjen student!";
        else labelBon.innerHTML="Imate: "+this.uplaceno+" uplacena bona."; 

    }
}
