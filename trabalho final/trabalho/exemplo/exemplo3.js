//---------------------------------------------------------------
// Terceiro Exemplo de Execução Assíncrona. Agora com o uso do método then
//---------------------------------------------------------------

function promessa2(token) {
  return new Promise(
    function(resolve,reject) {
      let sorteio = Math.random() * 100;
        if(sorteio < 50)
          resolve('Ok: ' + sorteio + " token = " + token); 
        else 
          reject('Falha: ' + sorteio + " token = " + token);
    });  
}


function execQuandoResolve(value) { 
          console.log('Ok: ' + value); 
        }

function execQuandoReject(value)  { 
        console.log('Falha: ' + value);
      }


async function exemplo2() {
  try {
    
    console.log("Ponto 1");
    
    // Para Token = Ponto 1
    promessa2("Ponto 1").then( execQuandoResolve,  execQuandoReject) ;
    
    console.log("Ponto 2");

    // Para Token = Ponto 2
    promessa2("Ponto 2").then( execQuandoResolve,  execQuandoReject) ;
    
    console.log("Ponto 3");

    // Para Token = Ponto 3
     promessa2("Ponto 3").then( execQuandoResolve );
    
    console.log("Ponto 4");

    // Para Token = Ponto 4
    await promessa2("Ponto 4") ;
    
    console.log("Ponto 5");

  }
  catch(e) { 
    console.log('Erro: ' + e);
  }
}

exemplo2();
