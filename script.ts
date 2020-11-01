interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (q): HTMLInputElement => document.querySelector(q);

  function calcTempo(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`;
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class="delete" data-placa="${veiculo.placa}">X</button>
        </td>
      `;

      row.querySelector(".delete").addEventListener("click", function () {
        remover(this.dataset.placa);
      });

      $("#patio").appendChild(row);

      if (salva) salvar([...ler(), veiculo]);
    }

    function remover(placa: string) {
      const { entrada, nome } = ler().find((item) => item.placa === placa);

      const tempo = calcTempo(
        new Date().getTime() - new Date(entrada).getTime()
      );

      if (!confirm(`O veiculo ${nome} ficou estacionado no pátio por ${tempo}`))
        return;

      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
      render();
    }

    function render() {
      $("#patio").innerHTML = "";

      if (ler().length) {
        ler().forEach((veiculo) => adicionar(veiculo));
      }
    }

    return { ler, adicionar, salvar, render };
  }

  patio().render();

  $("#cadastrar").addEventListener("click", (ev) => {
    const nome = $("#nome").value;
    const placa = $("#placa").value;

    if (!nome.length || !placa.length) {
      alert("Placa e Nome são obrigatórios");
      return;
    }

    const veiculo: Veiculo = { nome, placa, entrada: new Date().toISOString() };

    patio().adicionar(veiculo, true);
  });
})();
