"use strict";

import Status from "./Status.js";
import Disciplina from "./Disciplina.js";
import DaoDisciplina from "./DaoDisciplina.js";
import ViewerDisciplina from "./ViewerDisciplina.js";

export default class CtrlManterDisciplina {
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao; // Referência para o Data Access Object para o Store de Alunos
  #viewer; // Referência para o gerenciador do viewer
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status; // Indica o que o controlador está fazendo

  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoDisciplina();
    this.#viewer = new ViewerDisciplina(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados
    this.#viewer.statusApresentacao();

    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjDisciplinas = await this.#dao.obterDisciplinas();

    // Se a lista de alunos estiver vazia
    if (conjDisciplinas.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;

      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    } else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if (this.#posAtual == 0 || this.#posAtual > conjDisciplinas.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(
        this.#posAtual,
        conjDisciplinas.length,
        conjDisciplinas[this.#posAtual - 1]
      );
    }
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjDisciplinas = await this.#dao.obterDisciplinas();
    if (conjDisciplinas.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjDisciplinas = await this.#dao.obterDisciplinas();
    if (this.#posAtual < conjDisciplinas.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjDisciplinas = await this.#dao.obterDisciplinas();
    this.#posAtual = conjDisciplinas.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarAlterar() {
    console.log("alterando");
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir.
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(idDisciplina, disciplina, cargaHoraria) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let aluno = new Disciplina(idDisciplina, disciplina, cargaHoraria);
        console.log(`alunio`, aluno);
        await this.#dao.incluir(aluno);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(idDisciplina, disciplina, ch) {
    console.log(idDisciplina, disciplina, ch);
    if (this.#status == Status.ALTERANDO) {
      try {
        let aluno = await this.#dao.alterarDisciplina(
          idDisciplina,
          disciplina,
          ch
        );
        console.log(aluno);
        // if (aluno == null) {
        //   alert('A disciplina chamada' + idDisciplina + ' não foi encontrada.');
        // } else {
        //   aluno.setIdDisciplina(idDisciplina);
        //   await this.#dao.alterar(aluno);
        // }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(idDisciplina) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let aluno = await this.#dao.obterDisciplinaPeloId(idDisciplina);
        if (aluno == null) {
          alert("A disciplina chamada" + IdDisciplina + " não foi encontrada.");
        } else {
          await this.#dao.excluir(aluno);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//
