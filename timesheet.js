(function () {
    const ID_BASE = "ContentPlaceHolder1_gvGridView_1707_txtLISTA_1707";
    const DEFAULT_VALUES = ["09:00", "13:00", "14:00", "18:00"];
    const DEFAULT_ROWS = 31;
    const DEFAULT_DELAY = 100;

    const panel = document.createElement("div");
    panel.id = "timesheet-panel";
    panel.style.cssText = `
        position: fixed; top: 20px; left: 20px; width: 300px;
        background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif; z-index: 9999;
    `;
    panel.innerHTML = `
        <div id="panel-header" style="background:#0078D7;color:#fff;padding:8px;cursor:move;">
            Timesheet AutoFill
            <button id="btn-minimize" style="float:right;background:#fff;color:#0078D7;border:none;cursor:pointer;">−</button>
            <button id="btn-close" style="float:right;background:#fff;color:#0078D7;border:none;cursor:pointer;">×</button>
        </div>
        <div id="panel-body" style="padding:10px;">
            <label>Parte variável do ID:</label>
            <input id="id-variable" type="text" style="width:100%;margin-bottom:8px;" placeholder="Ex.: 2_410888_0"><br>
            
            <label>Valores (vírgula):</label>
            <input id="values" type="text" style="width:100%;margin-bottom:8px;" value="${DEFAULT_VALUES.join(",")}"><br>
            
            <label>Qtd. Linhas:</label>
            <input id="rows" type="number" style="width:100%;margin-bottom:8px;" value="${DEFAULT_ROWS}"><br>
            
            <label>Delay (ms):</label>
            <input id="delay" type="number" style="width:100%;margin-bottom:8px;" value="${DEFAULT_DELAY}"><br>
            
            <button id="btn-execute" style="width:100%;margin-bottom:8px;background:#0078D7;color:#fff;border:none;padding:8px;cursor:pointer;">Executar</button>
            <button id="btn-save" style="width:100%;background:#ccc;color:#000;border:none;padding:8px;cursor:pointer;">Salvar Configuração</button>
        </div>
    `;
    document.body.appendChild(panel);

    function saveConfig() {
        const config = {
            idVariable: document.getElementById("id-variable").value,
            values: document.getElementById("values").value,
            rows: document.getElementById("rows").value,
            delay: document.getElementById("delay").value
        };
        localStorage.setItem("timesheetConfig", JSON.stringify(config));
        console.log("✅ Configuração salva:", config);
    }

    function loadConfig() {
        const config = JSON.parse(localStorage.getItem("timesheetConfig"));
        if (config) {
            document.getElementById("id-variable").value = config.idVariable;
            document.getElementById("values").value = config.values;
            document.getElementById("rows").value = config.rows;
            document.getElementById("delay").value = config.delay;
            console.log("✅ Configuração carregada:", config);
        }
    }

    function triggerEvents(el) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    async function executeFill() {
        const idVariable = document.getElementById("id-variable").value.trim();
        const values = document.getElementById("values").value.split(",").map(v => v.trim());
        const rows = parseInt(document.getElementById("rows").value);
        const delay = parseInt(document.getElementById("delay").value);

        if (!idVariable) {
            alert("Informe a parte variável do ID!");
            return;
        }

        const parts = idVariable.split("_"); // Ex.: ["2", "410888", "0"]
        if (parts.length < 3) {
            alert("Formato inválido! Use algo como: 2_410888_0");
            return;
        }

        const baseNumber = parseInt(parts[1], 10); // número que será incrementado
        console.log("🚀 Iniciando preenchimento...");
        console.log(`ID Base: ${ID_BASE}`);
        console.log(`Parte variável: ${idVariable}`);
        console.log(`Valores: ${values}`);
        console.log(`Linhas: ${rows}, Delay: ${delay}ms`);

        for (let i = 0; i < rows; i++) {
            for (let col = 0; col < values.length; col++) {
                const dynamicId = `${ID_BASE}_${col + 2}_${baseNumber + i}_${i}`;
                const el = document.getElementById(dynamicId);
                if (el) {
                    el.value = values[col];
                    triggerEvents(el);
                    console.log(`✅ Preenchido: ${dynamicId} -> ${values[col]}`);
                } else {
                    console.warn(`⚠️ Campo não encontrado: ${dynamicId}`);
                }
            }
            await new Promise(res => setTimeout(res, delay));
        }
        console.log("✅ Preenchimento concluído!");
    }

    document.getElementById("btn-execute").onclick = executeFill;
    document.getElementById("btn-save").onclick = saveConfig;
    document.getElementById("btn-close").onclick = () => panel.remove();
    document.getElementById("btn-minimize").onclick = () => {
        const body = document.getElementById("panel-body");
        if (body.style.display === "none") {
            body.style.display = "block";
            document.getElementById("btn-minimize").textContent = "−";
        } else {
            body.style.display = "none";
            document.getElementById("btn-minimize").textContent = "+";
        }
    };

    const header = document.getElementById("panel-header");
    let isDragging = false, offsetX, offsetY;
    header.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
    });
    document.addEventListener("mousemove", e => {
        if (isDragging) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener("mouseup", () => isDragging = false);

    loadConfig();
})();
