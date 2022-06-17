"use strict";

export default class Status {
  #nome;
  static NAVEGANDO = new Status('Navegando');
  static INCLUINDO = new Status('Incluindo');  
  static ALTERANDO = new Status('Alterando');  
  static EXCLUINDO = new Status('Excluindo');  
  
  constructor(nome) {
    this.#nome = nome;
  }  
}