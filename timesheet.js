(function () {
    const DEFAULT_VALUES = ["09:00", "13:00", "14:00", "18:00"];
    const DEFAULT_ROWS = 31;
    const DEFAULT_DELAY = 100;

    function getIdBase() {
        const allInputs = document.querySelectorAll('[id*="txtLISTA"]');
        if (allInputs.length > 0) {
            const firstId = allInputs[0].id;
            const parts = firstId.split("_");
            return parts.slice(0, 5).join("_"); // até txtLISTA_1707
        }
        return null;
    }

    function getVariableId(idBase) {
        const allInputs = document.querySelectorAll(`[id^="${idBase}"]`);
        if (allInputs.length > 0) {
            const firstId = allInputs[0].id;
            return firstId.replace(idBase + "_", ""); // Ex.: 2_410887_0 ou 410887_0
        }
        return null;
    }

    function triggerEvents(el) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    async function autoFill() {
        const idBase = getIdBase();
        if (!idBase) {
            console.error("❌ Não foi possível detectar o ID_BASE.");
            return;
        }

        const idVariable = getVariableId(idBase);
        if (!idVariable) {
            console.error("❌ Não foi possível detectar a parte variável do ID.");
            return;
        }

        const parts = idVariable.split("_");
        let baseNumber, startIndex;

        // Sempre força coluna inicial = 2
        if (parts.length === 3) {
            baseNumber = parseInt(parts[1], 10);
            startIndex = parseInt(parts[2], 10);
        } else if (parts.length === 2) {
            baseNumber = parseInt(parts[0], 10);
            startIndex = parseInt(parts[1], 10);
        } else {
            console.error("❌ Formato inesperado:", idVariable);
            return;
        }

        console.log("✅ ID_BASE:", idBase);
        console.log("✅ Parte variável:", idVariable);
        console.log("🚀 Iniciando preenchimento automático...");

        for (let i = 0; i < DEFAULT_ROWS; i++) {
            for (let col = 0; col < DEFAULT_VALUES.length; col++) {
                const dynamicId = `${idBase}_${2 + col}_${baseNumber + i}_${startIndex + i}`;
                const el = document.getElementById(dynamicId);
                if (el) {
                    el.value = DEFAULT_VALUES[col];
                    triggerEvents(el);
                    console.log(`✅ ${dynamicId} -> ${DEFAULT_VALUES[col]}`);
                } else {
                    console.warn(`⚠️ Campo não encontrado: ${dynamicId}`);
                }
            }
            await new Promise(res => setTimeout(res, DEFAULT_DELAY));
        }
        console.log("✅ Preenchimento concluído!");
    }

    autoFill();
})();
