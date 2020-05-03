
<!--PostMetod-->

const addDevice = async (device) => {
   
    const settings = {
      method: 'POST',
      body: JSON.stringify(device),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  
    const response = await fetch(`http://localhost:3000/meni`, settings);
    if (!response.ok) throw Error(response.message);
  
    try {
      
    } catch (err) {
      throw err;
    }
  };
  
  <!--Kraj-->

  <!--HTML-->
  


  <!--Korisnkici-->
  

 



  <!--INDEKS-->
  