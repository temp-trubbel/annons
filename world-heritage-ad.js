class WorldHeritageAd extends HTMLElement {
    constructor() {
        // Super måste alltid anropas först i konstruktorn
        super();

        // Lägger till Shadow DOM
        this.attachShadow({ mode: "open" });

        // Laddar in Shoelace
        this.loadShoelace();
    }

    loadShoelace() {
        // Laddar in Shoelace CSS ifall det inte redan är inlagt
        if (!document.querySelector("link[data-shoelacecss]")) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css";
            link.dataset.shoelacecss = true;
            document.head.appendChild(link);
        }

        // Laddar in Shoelace JS ifall det inte redan är inlagt
        if (!document.querySelector("script[data-shoelacejs]")) {
            const script = document.createElement("script");
            script.type = "module";
            script.src = "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace.js";
            script.dataset.shoelacejs = true;
            document.head.appendChild(script);
        }
    }

    async connectedCallback() {
        // Render skeleton
        // code...

        // Hitta användarens koordinater
        const coordinates = await this.findMyCoordinates()
        console.log("longitude:", coordinates.longitude);
        console.log("latitude:", coordinates.latitude);

        // GET världsarv från API
        const worldHeritage = await this.getWorldHeritage(coordinates)
        console.log(worldHeritage);

        // Render final
        this.render(worldHeritage)
    }

    render(worldHeritage) {
        // Skapar HTML-mall
        const template = document.createElement("template");
        template.innerHTML =
        `
        <style>
            .cardAd {
                max-width: 600px;

                & .cardImage {
                    aspect-ratio: 4/1;
                    object-fit: cover;
                }

                & .cardBody {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    sl-avatar {
                        --size: 7rem;
                    }

                    & .cardText {
                        h1, p {
                            margin: 0;
                        }
                        
                        & .shortDescription {

                        }
                    }
                }
            }
        </style>

        <sl-card class="cardAd">
            <img class="cardImage" slot="image" src="${worldHeritage.main_image_url}" />

            <div class="cardBody">
                <sl-avatar shape="square">
                    <sl-icon slot="icon" name="bank"></sl-icon>
                </sl-avatar>

                <div class="cardText">
                    <h1>${worldHeritage.name_en}</h1>
                    <p class="shortDescription">${worldHeritage.short_description_en}</p>
                </div>

                <sl-button id="open-dialog-btn" variant="primary" size="large">Läs mer</sl-button>
            </div>
        </sl-card>

        <sl-dialog label="Prenumenera på tjänsten" id="dialog-more">
            <div style="height: 150vh;">
                <h1>${worldHeritage.name_en}</h1>

                <sl-carousel pagination mouse-dragging loop>
                    <sl-carousel-item>
                        <img src="https://whc.unesco.org/document/218642">
                    </sl-carousel-item>
                </sl-carousel>

                <p>${worldHeritage.short_description_en}</p>

                <sl-tab-group>
                    <sl-tab slot="nav" panel="subscribe">Varför prenumerera?</sl-tab>
                    <sl-tab slot="nav" panel="terms">Villkor</sl-tab>
                    <sl-tab slot="nav" panel="installation">Installationsprocess</sl-tab>

                    <sl-tab-panel name="subscribe">
                        <p>Lorem ipsum1...</p>
                    </sl-tab-panel>

                    <sl-tab-panel name="terms">
                        <p>Lorem ipsum2...</p>
                    </sl-tab-panel>

                    <sl-tab-panel name="installation">
                        <p>Lorem ipsum3...</p>
                    </sl-tab-panel>
                </sl-tab-group>

                <sl-divider style="--spacing: 2rem;"></sl-divider>

                <form>
                    <sl-input label="Namn"></sl-input>
                    <sl-input label="E-post" type="email"></sl-input>
                    <sl-input label="Telefonnummer"></sl-input>

                    <sl-checkbox>Jag har ett svenskt personnummer</sl-checkbox>
                    <sl-input label="Personnummer" disabled></sl-input>
                </form>

                <form>
                    <sl-input label="Betala med kort" placeholder="Kortnummer"></sl-input>
                    <div>
                        <sl-input placeholder="MM / YY"></sl-input>
                        <sl-input placeholder="CVC"></sl-input>
                    </div>
                </form>

                <sl-button variant="success" size="large" style="width: 100%;">Betala</sl-button>
            </div>
        </sl-dialog>
        `

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const openDialogBtn = this.shadowRoot.querySelector("#open-dialog-btn");
        const dialog = this.shadowRoot.querySelector("#dialog-more");
        openDialogBtn.addEventListener('click', () => dialog.show());
    }

    async findMyCoordinates() {
        if ("geolocation" in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(success, error);

                function success(position) {
                    const crd = position.coords;
                    resolve(crd);
                }

                function error(error) {
                    reject(error.message)
                }
            });
        }
        
        else {
            /* geolocation IS NOT available */
            return {}
        }
    }

    // bör ta in longitude & latittue från geolocation API
    async getWorldHeritage(coords) {
        try {
            // Hämtar världsarv från Backend API
            const response = await fetch(`http://localhost:8000/something?longitude=${coords.longitude}&latitude=${coords.latitude}`);
            const data = await response.json();

            // Retunerar kategorierna
            return data;
            
        } catch (error) {
            console.error(error);
            return {};
        }
    }
}


customElements.define("world-heritage-ad", WorldHeritageAd);