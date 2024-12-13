class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.fetchWeatherData();
    }
    async fetchWeatherData() {
        const latitude = 55.7558;
        const longitude = 37.6173;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.updateWeather(data);
        } 
        catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    updateWeather(data) {
        const temperature = data.hourly.temperature_2m[0];
        const precipitationProbability = data.hourly.precipitation_probability[0];
        const precipitation = data.hourly.precipitation[0];
        const tempElement = this.shadowRoot.querySelector('.temp');
        const conditionElement = this.shadowRoot.querySelector('.condition');
        const commentElement = this.shadowRoot.querySelector('.comment');
        tempElement.textContent = `${temperature}°C`;
        conditionElement.textContent = `Осадки: ${precipitation} мм`;
        if (temperature <= 0) {
            commentElement.textContent = "🥶❄️";
        } 
        else if (precipitationProbability > 50) {
            commentElement.textContent = "☔🌧️";
        } 
        else if (temperature > 30) {
            commentElement.textContent = "☀️🕶️";
        } 
        else {
            commentElement.textContent = "✨🌞";
        }
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this._getStyles()}
            </style>
            <div class="weather-widget">
                <h2>Погода в Москве</h2>
                <div class="emoji"></div>
                <div class="temp">Загрузка...</div>
                <div class="condition">Загрузка...</div>
                <div class="comment">Загрузка...</div>
            </div>
        `;
    }
    _getStyles() {
        return `
            :host {
                display: block;
                --font-size: 18px;
                --border-color: pink;
            }
            
            .weather-widget {
                background-color: white;
                border-radius: 10px;
                width: 500px;
                height:200px;
                text-align: center;
                font-size: var(--font-size);
                color: var(--text-color);
                border: 4px solid var(--border-color);
                margin: auto;
                display: block;
            }
            .weather-widget h2 {
                font-size: 20px;
                padding:20px;
                border-bottom: 4px dashed pink;
            }
            .temp {
                font-weight: bold;
            }


        `;
    }
}
customElements.define('weather-widget', WeatherWidget);