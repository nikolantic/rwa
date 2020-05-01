 class Korisnici{

    constructor(ime,prezime,indeks,bonovi)
    {
       
        this.ime=ime;
        this.prezime=prezime;
        this.indeks=indeks;
        this.bonovi=bonovi;
    }

    static errorUser() {
		return new Korisnici("","","");
    }
    
    drawUserInformation(host){

        const label=document.createElement('label');
        label.innerHTML="Ime: "+this.ime;
        host.appendChild(label);
        const label2=document.createElement('label');
        label2.innerHTML="Prezime: "+this.prezime;
        host.appendChild(label);
        const label3=document.createElement('label');
        label3.innerHTML="Indeks: "+this.indeks;
        host.appendChild(label3);
        const label4=document.createElement('label');
        label4.innerHTML="Bonovi: "+this.bonovi;
        host.appendChild(label4);

    }
}
export default Korisnici