import ModelError from "./ModelError.js";

export default class Disciplina {
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  idDisciplina;
  disciplina;
  cargaHoraria;

  //-----------------------------------------------------------------------------------------//

  constructor(idDisciplina, disciplina, cargaHoraria) {
    this.setIdDisciplina(idDisciplina);
    this.setDisciplina(disciplina);
    this.setCH(cargaHoraria);
  }

  //-----------------------------------------------------------------------------------------//

  getIdDisciplina() {
    return this.idDisciplina;
  }
  getDisciplina() {
    return this.disciplina;
  }
  getCh() {
    return this.cargaHoraria;
  }

  //-----------------------------------------------------------------------------------------//

  setIdDisciplina(idDisciplina) {
    if (!Disciplina.validarIdDisciplina(idDisciplina))
      throw new ModelError("Disciplina Inválida: " + idDisciplina);
    this.idDisciplina = idDisciplina;
  }

  static validarIdDisciplina(idDisciplina) {
    if (idDisciplina == null || idDisciplina == "" || idDisciplina == undefined)
      return false;
    const padraoMatricula = /[0-9]/;
    if (!padraoMatricula.test(idDisciplina)) return false;
    return true;
  }

  //-------------------------------------------------------------------------------------

  //-----------------------------------------------------------------------------------------//
  setDisciplina(disciplina) {
    if (!Disciplina.validarDisciplina(disciplina))
      throw new ModelError("Disciplina Inválida: " + disciplina);
    this.disciplina = disciplina;
  }

  setCH(cargaHoraria) {
    if (!Disciplina.validarCH(cargaHoraria))
      throw new ModelError("Carga horia invalida");
    this.cargaHoraria = cargaHoraria;
  }

  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return {
      idDisciplina: this.idDisciplina,
      disciplina: this.disciplina,
      cargaHoraria: this.cargaHoraria,
    };
  }

  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Disciplina(obj.idDisciplina, obj.disciplina, obj.cargaHoraria);
  }

  //-----------------------------------------------------------------------------------------//

  static deassign(obj) {
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  //-----------------------------------------------------------------------------------------//
  static validarCpf(strCpf) {
    let soma;
    let resto;
    let i;

    soma = 0;
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace("-", "");

    if (strCpf == "00000000000") return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(10, 11))) return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarDisciplina(disciplina) {
    if (disciplina == null || disciplina == "" || disciplina == undefined)
      return false;
    if (disciplina.length > 100) return false;
    // const padraoDisciplina = /[A-Z][a-z]*/;
    // if (!padraoDisciplina.test(disciplina)) return false;
    return true;
  }

  static validarCH(cargaHoraria) {
    if (!cargaHoraria || cargaHoraria.length > 3) {
      return false;
    }
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarEmail(email) {
    if (email == null || email == "" || email == undefined) return false;

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email)) return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTelefone(telefone) {
    if (telefone == null || telefone == "" || telefone == undefined)
      return false;

    const padraoTelefone =
      /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    if (!padraoTelefone.test(telefone)) return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  mostrar() {
    let texto = "IdDisciplina: " + this.idDisciplina + "\n";
    texto += "Disciplina: " + this.disciplina + "\n";

    alert(texto);
    alert(JSON.stringify(this));
  }
}
