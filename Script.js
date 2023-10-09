const MODEL_URL = "https://teachablemachine.withgoogle.com/models/iFTM9PWce/";
let model, webcam, labelContainer, maxPredictions;

window.onload = async () => {
    await init();
};

async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    document.getElementById("upload").addEventListener('change', predict);
}

async function fetchFIRMSData() {
    const apiKey = "SUA_CHAVE_API";
    const url = "URL_DO_ENDPOINT";
    const params = `?key=${apiKey}`; // Adicione outros parâmetros aqui

    const response = await fetch(url + params);
    const data = await response.json();

    // Faça algo com os dados da API da NASA aqui
    // Talvez atualizar o DOM ou enviar para outra função
}

async function predict() {
    let image = document.getElementById("upload").files[0];
    let img = document.createElement("img");
    img.src = URL.createObjectURL(image);
    img.onload = async () => {
        img.width = 200;
        img.height = 200;
        document.getElementById("webcam-container").innerHTML = '';
        document.getElementById("webcam-container").appendChild(img);
        
        // Limpar resultados anteriores
        labelContainer.innerHTML = '';

        const prediction = await model.predict(img);
        let maxProbability = -1;
        let maxClass = null;
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;

            if (prediction[i].probability > maxProbability) {
                maxProbability = prediction[i].probability;
                maxClass = prediction[i].className;
            }
        }

        // Mostrando o resultado com a maior porcentagem como resultado final
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `<strong>Resultado Final: ${maxClass} (${(maxProbability * 100).toFixed(2)}%)</strong>`;
        labelContainer.appendChild(resultDiv);

        // Chamar a função para buscar dados da API da NASA FIRMS
        fetchFIRMSData();
    };
}
