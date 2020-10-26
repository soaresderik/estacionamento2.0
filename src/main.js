var EstacionamentoFront = /** @class */ (function () {
    function EstacionamentoFront($, estacionamento) {
        if (estacionamento === void 0) { estacionamento = new Estacionamento(); }
        this.$ = $;
        this.estacionamento = estacionamento;
    }
    EstacionamentoFront.prototype.adicionar = function (carro, salvar) {
        if (salvar === void 0) { salvar = false; }
        this.estacionamento.adicionar(carro);
        var row = document.createElement("tr");
        row.innerHTML = "\n                <td>" + carro.nome + "</td>\n                <td>" + carro.placa + "</td>\n                <td data-time=\"" + carro.entrada + "\">\n                    " + carro.entrada.toLocaleString("pt-BR", {
            hour: "numeric",
            minute: "numeric"
        }) + "\n                </td>\n                <td>\n                    <button class=\"delete\">x</button>\n                </td>\n            ";
        if (salvar) {
            this.estacionamento.salvar();
        }
        this.$("#garage").appendChild(row);
    };
    EstacionamentoFront.prototype.encerrar = function (cells) {
        if (cells[2] instanceof HTMLElement) {
            var veiculo = {
                nome: cells[0].textContent || "",
                placa: cells[1].textContent || "",
                tempo: new Date().valueOf() -
                    new Date(cells[2].dataset.time).valueOf()
            };
            this.estacionamento.encerrar(veiculo);
        }
    };
    EstacionamentoFront.prototype.render = function () {
        var _this = this;
        this.$("#garage").innerHTML = "";
        this.estacionamento.patio.forEach(function (c) { return _this.adicionar(c); });
    };
    return EstacionamentoFront;
}());
var Estacionamento = /** @class */ (function () {
    function Estacionamento() {
        this.patio = localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    Estacionamento.prototype.adicionar = function (carro) {
        this.patio.push(carro);
    };
    Estacionamento.prototype.encerrar = function (info) {
        var tempo = this.calcTempo(info.tempo);
        var msg = "\n      O ve\u00EDculo " + info.nome + " de placa " + info.placa + " permaneceu " + tempo + " estacionado.\n      \n\n Deseja encerrar?\n    ";
        if (!confirm(msg))
            return;
        this.patio = this.patio.filter(function (carro) { return carro.placa !== info.placa; });
        this.salvar();
    };
    Estacionamento.prototype.calcTempo = function (mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return min + "m e " + sec + "s";
    };
    Estacionamento.prototype.salvar = function () {
        console.log("Salvando...");
        localStorage.patio = JSON.stringify(this.patio);
    };
    return Estacionamento;
}());
(function () {
    var $ = function (q) {
        var elem = document.querySelector(q);
        if (!elem)
            throw new Error("Ocorreu um erro ao buscar o elemento.");
        return elem;
    };
    var estacionamento = new EstacionamentoFront($);
    estacionamento.render();
    $("#send").addEventListener("click", function () {
        var nome = $("#name").value;
        var placa = $("#licence").value;
        if (!nome || !placa) {
            alert("Os campos são obrigatórios.");
            return;
        }
        var carro = { nome: nome, placa: placa, entrada: new Date() };
        estacionamento.adicionar(carro, true);
        $("#name").value = "";
        $("#licence").value = "";
    });
    $("#garage").addEventListener("click", function (_a) {
        var target = _a.target;
        if (target.className === "delete") {
            estacionamento.encerrar(target.parentElement.parentElement.cells);
            estacionamento.render();
        }
    });
})();
