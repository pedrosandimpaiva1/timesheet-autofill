(function () {
    const DEFAULT_VALUES = "09:00,13:00,14:00,18:00";

    // Cria painel flutuante
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
            <label>Horários (vírgula):</label>
            <input id="values" type="text" style="width:100%;margin-bottom:8px;" value="${DEFAULT_VALUES}"><br>
            <button id="btn-execute" style="width:100%;background:#0078D7;color:#fff;border:none;padding:8px;cursor:pointer;">Executar</button>
        </div>
    `;
    document.body.appendChild(panel);

    // Função para arrastar painel
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

    // Botões minimizar e fechar
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

    // Função para preencher automaticamente
    async function autoFill() {
        const values = document.getElementById("values").value.split(",").map(v => v.trim());
        const idBase = (() => {
            const allInputs = document.querySelectorAll('[id*="txtLISTA"]');
            if (allInputs.length > 0) {
                const firstId = allInputs[0].id.split("_");
                return firstId.slice(0, 5).join("_");
            }
            return null;
        })();
        const idVariable = (() => {
            const allInputs = document.querySelectorAll(`[id^="${idBase}"]`);
            if (allInputs.length > 0) {
                return allInputs[0].id.replace(idBase + "_", "");
            }
            return null;
        })();

        if (!idBase || !idVariable) {
            console.error("❌ Não foi possível detectar IDs.");
            return;
        }

        const parts = idVariable.split("_");
        let baseNumber = parts.length >= 2 ? parseInt(parts[parts.length - 2], 10) : 0;
        let startIndex = parts.length >= 1 ? parseInt(parts[parts.length - 1], 10) : 0;

        console.log("✅ ID_BASE:", idBase);
        console.log("✅ Parte variável:", idVariable);

        for (let i = 0; i < 31; i++) {
            for (let col = 0; col < values.length; col++) {
                const dynamicId = `${idBase}_${2 + col}_${baseNumber + i}_${startIndex + i}`;
                const el = document.getElementById(dynamicId);
                if (el) {
                    el.value = values[col];
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                    console.log(`✅ ${dynamicId} -> ${values[col]}`);
                } else {
                    console.warn(`⚠️ Campo não encontrado: ${dynamicId}`);
                }
            }
            await new Promise(res => setTimeout(res, 100));
        }
        console.log("✅ Preenchimento concluído!");
    }

    document.getElementById("btn-execute").onclick = autoFill;
})();
