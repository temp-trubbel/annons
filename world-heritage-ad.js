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
            }
        }
    }
</style>

<sl-card class="cardAd">
    <img class="cardImage" slot="image" src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" />

    <div class="cardBody">
        <sl-avatar shape="square">
            <sl-icon slot="icon" name="bank"></sl-icon>
        </sl-avatar>

        <div class="cardText">
            <h1>Titel</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa perspiciatis nobis labore, ut ipsum dicta fugit voluptatem ratione illum, eveniet dolor amet est. Eius fuga pariatur, excepturi sed a cupiditate.</p>
        </div>

        <sl-button variant="primary" size="large">Läs mer</sl-button>
    </div>
</sl-card>
`

class WorldHeritageAd extends HTMLElement {
    constructor() {
        // Super måste alltid anropas först i konstruktorn
        super();

        // Lägger till Shadow DOM
        this.attachShadow({ mode: "open" });

        // Laddar in Shoelace
        this.loadShoelace();
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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
}


customElements.define("world-heritage-ad", WorldHeritageAd);