"use strict";

import ModelError from "./ModelError.js";
import Disciplina from "./Disciplina.js";

export default class DaoDisciplina {
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayAlunos = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//

  /*
   *  Devolve uma Promise com a referência para o BD
   */
  async obterConexao() {
    if (DaoDisciplina.conexao == null) {
      DaoDisciplina.conexao = new Promise(function (resolve, reject) {
        let requestDB = window.indexedDB.open("DisciplinaDB", 1);

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("DisciplinaST", {
            autoIncrement: true,
          });
          store.createIndex("idxMatricula", "idDisciplina", { unique: true });
        };

        requestDB.onerror = (event) => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = (event) => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          } else reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoDisciplina.conexao;
  }

  //-----------------------------------------------------------------------------------------//

  async obterDisciplinas() {
    let connection = await this.obterConexao();
    let promessa = new Promise(function (resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["DisciplinaST"], "readonly");
        store = transacao.objectStore("DisciplinaST");
        indice = store.index("idxMatricula");
      } catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          const novo = Disciplina.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayAlunos = await promessa;
    return this.arrayAlunos;
  }

  //-----------------------------------------------------------------------------------------//

  async alterarDisciplina(idDisciplina, disciplina, ch) {
    let connection = await this.obterConexao();
    let resultado = new Promise(function (resolve, reject) {
      let transacao = connection.transaction(["DisciplinaST"], "readwrite");
      transacao.onerror = (event) => {
        reject(
          new ModelError(
            "Não foi possível alterar a disciplina",
            event.target.error
          )
        );
      };
      let store = transacao.objectStore("DisciplinaST");
      let indice = store.index("idxMatricula");
      var keyValue = IDBKeyRange.only(idDisciplina);
      indice.openCursor(keyValue).onsuccess = (event) => {
        const cursor = event.target.result;
        console.log(cursor);
        if (cursor) {
          cursor.update({
            cargaHoraria: ch,
            disciplina: disciplina,
            idDisciplina: idDisciplina,
          });
        } else {
        }
      };
    });
    return await resultado;
  }

  async obterDisciplinaPeloId(idDisciplina) {
    console.log(idDisciplina);
    let connection = await this.obterConexao();
    let promessa = new Promise(function (resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        console.log(`try`);
        transacao = connection.transaction(["DisciplinaST"], "readwrite");
        store = transacao.objectStore("DisciplinaST");
        indice = store.index("idxMatricula");
        window.location.reload();
      } catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(idDisciplina);
      consulta.onsuccess = function (event) {
        if (consulta.result != null)
          resolve(Disciplina.assign(consulta.result));
        else resolve(null);
      };
      consulta.onerror = function (event) {
        reject(null);
      };
    });
    let aluno = await promessa;
    return aluno;
  }

  //-----------------------------------------------------------------------------------------//

  async obterDisciplinaPeloAutoIncrement() {
    let connection = await this.obterConexao();
    let promessa = new Promise(function (resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["DisciplinaST"], "readonly");
        store = transacao.objectStore("DisciplinaST");
      } catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          const novo = Disciplina.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayAlunos = await promessa;
    return this.arrayAlunos;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(disciplina) {
    let connection = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let transacao = connection.transaction(["DisciplinaST"], "readwrite");
      transacao.onerror = (event) => {
        reject(
          new ModelError(
            "Não foi possível incluir a disciplina",
            event.target.error
          )
        );
      };
      let store = transacao.objectStore("DisciplinaST");
      let requisicao = store.add(disciplina);
      requisicao.onsuccess = function (event) {
        resolve(true);
        resolve(true);
        resolve(true);
        resolve(true);
        resolve(true);
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(aluno) {
    let connection = await this.obterConexao();
    let resultado = new Promise(function (resolve, reject) {
      let transacao = connection.transaction(["DisciplinaST"], "readwrite");
      transacao.onerror = (event) => {
        reject(
          new ModelError(
            "Não foi possível alterar a disciplina",
            event.target.error
          )
        );
      };
      let store = transacao.objectStore("DisciplinaST");
      let indice = store.index("idxDisciplina");
      var keyValue = IDBKeyRange.only(aluno.getMatricula());
      indice.openCursor(keyValue).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == aluno.getMatricula()) {
            const request = cursor.update(aluno);
            request.onsuccess = () => {
              console.log("[DaoAluno.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          }
        } else {
          reject(
            new ModelError(
              "Disciplina com ID " + aluno.getMatricula() + " não encontrada!",
              ""
            )
          );
        }
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(disciplina) {
    console.log("excluir", disciplina);
    let connection = await this.obterConexao();
    let transacao = await new Promise(function (resolve, reject) {
      let transacao = connection.transaction(["DisciplinaST"], "readwrite");
      transacao.onerror = (event) => {
        reject(
          new ModelError(
            "Não foi possível excluir a disciplina",
            event.target.error
          )
        );
      };
      let store = transacao.objectStore("DisciplinaST");
      let indice = store.index("idxMatricula");
      var keyValue = IDBKeyRange.only(disciplina.idDisciplina);
      indice.openCursor(keyValue).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
        } else {
          reject(
            new ModelError(
              "Disciplina com nome " +
                disciplina.getMatricula() +
                " não encontrada!",
              ""
            )
          );
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
