class EstacionamentoFront {
  constructor($) {
    this.$ = $;
    this.estacionamento = new Estacionamento();
  }

  adicionar(carro, salvar = false) {
    this.estacionamento.adicionar(carro);

    const row = document.createElement("tr");
    row.innerHTML = `
                <td>${carro.nome}</td>
                <td>${carro.placa}</td>
                <td data-time="${carro.entrada}">
                    ${new Date(carro.entrada).toLocaleString("pt-BR", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                </td>
                <td>
                    <button class="delete">x</button>
                </td>
            `;

    if (salvar) {
      this.estacionamento.salvar();
    }

    this.$("#garage").appendChild(row);
  }

  encerrar(cells) {
    const veiculo = {
      nome: cells[0].textContent,
      placa: cells[1].textContent,
      tempo: new Date() - new Date(cells[2].dataset.time),
    };

    this.estacionamento.encerrar(veiculo);
  }

  render() {
    this.$("#garage").innerHTML = "";
    this.estacionamento.patio.forEach((c) => this.adicionar(c));
  }
}

class Estacionamento {
  constructor() {
    this.patio = localStorage.patio ? JSON.parse(localStorage.patio) : [];
  }

  adicionar(carro) {
    this.patio.push(carro);
  }

  encerrar(info) {
    const tempo = this.calcTempo(info.tempo);

    const msg = `
      O veículo ${info.nome} de placa ${info.placa} permaneceu ${tempo} estacionado.
      \n\n Deseja encerrar?
    `;

    if (!confirm(msg)) return;

    this.patio = this.patio.filter((carro) => carro.placa !== info.placa);

    this.salvar();
  }

  calcTempo(mil) {
    var min = Math.floor(mil / 60000);
    var sec = Math.floor((mil % 60000) / 1000);
    return `${min}m e ${sec}s`;
  }

  salvar() {
    console.log("Salvando...");
    localStorage.patio = JSON.stringify(this.patio);
  }
}

(function () {
  const $ = (q) => document.querySelector(q);
  const estacionamento = new EstacionamentoFront($);
  estacionamento.render();

  $("#send").addEventListener("click", (e) => {
    const nome = $("#name").value;
    const placa = $("#licence").value;

    if (!nome || !placa) {
      alert("Os campos são obrigatórios.");
      return;
    }

    const carro = { nome, placa, entrada: new Date() };

    estacionamento.adicionar(carro, true);

    $("#name").value = "";
    $("#licence").value = "";
  });

  $("#garage").addEventListener("click", (e) => {
    if (e.target.className === "delete") {
      estacionamento.encerrar(e.target.parentElement.parentElement.cells);
      estacionamento.render();
    }
  });
})();
