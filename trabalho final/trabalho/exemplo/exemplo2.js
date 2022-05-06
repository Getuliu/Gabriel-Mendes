//---------------------------------------------------------------
// Segundo Exemplo de Execução Assíncrona. Agora COM Promise
//---------------------------------------------------------------

// Sleep Síncrono. Trava toda single thread
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

//---------------------------------------------------------------

function promessaAlternativa(token) {
  return new Promise(
    function(resolve,reject) {
      if(token == 'X') 
        resolve('Ok'); 
      else 
        reject('Falha');
    });  
}

//---------------------------------------------------------------
var tokenGlobal;

function funcConteudo(resolve,reject) {
  // 
  // CONTEÚDO DA FUNÇÃO...
  //
  setTimeout(() => { 
        let sorteio = Math.random() * 100;
        if(sorteio < 90)
          resolve("(" + sorteio + ") Resolvido após Timeout: " + tokenGlobal);
        else
          reject( "(" + sorteio + ") Rejeitado após o Timeout: " + tokenGlobal);
      }, 2000);
}

function funcProm(token) {

  tokenGlobal = token;
    
  // (1) Na Promise, o contexto de execução da função indicada será Assíncrono!
  // Não vemos isto, pois está no código (nativo) da classe Promise.
  // (2) A função vinculada à Promise irá dormir por 1 segundo para
  // depois escrever na console e executar a função resolve;
  return new Promise(funcConteudo);  
}

//---------------------------------------------------------------

async function exemplo () {
  try {
    let resultado = funcProm('X');
    console.log( "pré A) resultado = " + resultado );   // Lista [Object Promise]
    console.log( "a) resultado = " + await resultado ); // Lista o resultado
    console.log('ESTOU NO MEIO');
    console.log( "pré b) resultado = " + resultado );   // Lista [Object Promise]
    console.log( "b) resultado = " + await resultado ); // Lista o resultado
    
    resultado = funcProm('Y');
    console.log(  "Chamando funcProm com Y " + resultado ); // Lista [Object Promise] 
    console.log( "c) resultado = " + await resultado );     // Lista o resultado
  }
  catch(error) { 
    console.log("DEU ERRO: " + error );  
    alert('Erro:' + error);
  }
}

exemplo();
console.log("Após a chamada de exemplo...");

