(function(){
    const $ = q => document.querySelector(q);

    function convertPeriod(millis) {
        var min = Math.floor(millis / 60000);
        var sec = Math.floor((millis % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function renderGarage () {
        const patio = getPatio();
        $("#garage").innerHTML = "";
        patio.forEach(c => addCarToGarage(c))
    };

    function addCarToGarage (car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.veiculo}</td>
            <td>${car.placa}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        $("#garage").appendChild(row);
    };

    function checkOut(info) {
        let period = new Date() - new Date(info[2].dataset.time);
        period = convertPeriod(period);

        const placa = info[1].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${placa} permaneceu ${period} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getPatio().filter(c => c.placa !== placa);
        localStorage.patio = JSON.stringify(garage);
        
        renderGarage();
    };

    const getPatio = () => localStorage.patio ? JSON.parse(localStorage.patio) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const veiculo = $("#veiculo").value;
        const placa = $("#placa").value;

        if(!veiculo || !placa){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const data = { veiculo, placa, time: new Date() };

        const patio = getPatio();
        patio.push(data);

        localStorage.patio = JSON.stringify(patio);

        addCarToGarage(data);
    });

    $("#garage").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()