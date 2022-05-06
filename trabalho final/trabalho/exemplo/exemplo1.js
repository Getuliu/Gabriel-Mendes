//---------------------------------------------------------------
// Primeiro Exemplo de execução assíncrona sem Promise
// Stack Síncrona --- Fila Assíncrona
//---------------------------------------------------------------

function funcA() {
  console.log("Sou a função síncrona A - Passo 1");
  funcAux(1);
  console.log("Sou a função síncrona A - Passo 2");
  funcAux(2);
}

async function funcB() {
  console.log("Sou a funcB!");
  funcAux(3);
  console.log(1);
  await undefined;
  console.log(3);
  console.log("Fim da funcB!");
}

async function funcC() {
  console.log("Sou a funcC!");
  console.log(2);
  await undefined;
  console.log(4);
  console.log("Fim da funcC!");
}

function funcD() {
  console.log("Sou a síncrona funcD!");
}

async function funcAux(param) {
  console.log("Sou a funcAux com valor " + param);
  await console.log("funcAux com valor " + param + "parando...");
  console.log("funcAux " + param  + "retornando!");
  console.log("Fim da funcAux com valor " + param);
}

funcA();
funcB();
funcC(); 
funcD();












