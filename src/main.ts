interface Carro {
  nome: string;
  placa: string;
  entrada: Date;
}

interface Encerrar {
  nome: string;
  placa: string;
  tempo: number;
}

class EstacionamentoFront {
  constructor(
    private $: (q: string) => HTMLInputElement,
    private estacionamento = new Estacionamento()
  ) {}

  adicionar(carro: Carro, salvar = false) {
    this.estacionamento.adicionar(carro);

    const row = document.createElement("tr");
    row.innerHTML = `
                <td>${carro.nome}</td>
                <td>${carro.placa}</td>
                <td data-time="${carro.entrada}">
                    ${carro.entrada.toLocaleString("pt-BR", {
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

  encerrar(cells: HTMLCollection) {
    if (cells[2] instanceof HTMLElement) {
      const veiculo = {
        nome: cells[0].textContent || "",
        placa: cells[1].textContent || "",
        tempo:
          new Date().valueOf() -
          new Date(cells[2].dataset.time as string).valueOf(),
      };

      this.estacionamento.encerrar(veiculo);
    }
  }

  render() {
    this.$("#garage").innerHTML = "";
    this.estacionamento.patio.forEach((c) => this.adicionar(c));
  }
}

class Estacionamento {
  public patio: Carro[];
  constructor() {
    this.patio = localStorage.patio ? JSON.parse(localStorage.patio) : [];
  }

  adicionar(carro: Carro) {
    this.patio.push(carro);
  }

  encerrar(info: Encerrar) {
    const tempo = this.calcTempo(info.tempo);

    const msg = `
      O veículo ${info.nome} de placa ${info.placa} permaneceu ${tempo} estacionado.
      \n\n Deseja encerrar?
    `;

    if (!confirm(msg)) return;

    this.patio = this.patio.filter((carro) => carro.placa !== info.placa);

    this.salvar();
  }

  private calcTempo(mil: number) {
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
  const $ = (q: string) => {
    const elem = document.querySelector<HTMLInputElement>(q);

    if (!elem) throw new Error("Ocorreu um erro ao buscar o elemento.");

    return elem;
  };

  const estacionamento = new EstacionamentoFront($);
  estacionamento.render();

  $("#send").addEventListener("click", () => {
    const nome = $("#name").value;
    const placa = $("#licence").value;

    if (!nome || !placa) {
      alert("Os campos são obrigatórios.");
      return;
    }

    const carro: Carro = { nome, placa, entrada: new Date() };

    estacionamento.adicionar(carro, true);

    $("#name").value = "";
    $("#licence").value = "";
  });

  $("#garage").addEventListener("click", ({ target }: MouseEvent | any) => {
    if (target.className === "delete") {
      estacionamento.encerrar(target.parentElement.parentElement.cells);
      estacionamento.render();
    }
  });
})();
