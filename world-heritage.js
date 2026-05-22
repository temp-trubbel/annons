class WorldHeritage extends HTMLElement {
    constructor() {
        // Super måste alltid anropas först i konstruktorn
        super();

        // Lägger [INTE] till Shadow DOM!
        // this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        // Hitta användarens koordinater
        const coordinates = await this.findMyCoordinates();
        console.log("longitude:", coordinates.longitude);
        console.log("latitude:", coordinates.latitude);

        // GET världsarv från API
        const worldHeritage = await this.getWorldHeritage(coordinates);
        console.log(worldHeritage);

        // Render template
        this.render(worldHeritage);

        const clientSecret = await this.getClientSecret();
        console.log("clientSecret:", clientSecret);

        this.initStripeCheckout(clientSecret);
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

        <div class="cardAd">
            <img class="cardImage" slot="image" src="${worldHeritage.main_image_url}" />

            <div class="cardBody">
                <div>
                    <div>Ikon för UNESCO</div>
                </div>

                <div class="cardText">
                    <h1>${worldHeritage.name_en}</h1>
                    <p class="shortDescription">${worldHeritage.short_description_en}</p>
                </div>

                <button id="open-dialog-btn">Läs mer</button>
            </div>
        </div>

        <div id="dialog-more">
            <div style="height: 150vh;">
                <h1>${worldHeritage.name_en}</h1>

                <img src="https://whc.unesco.org/document/218642">

                <p>${worldHeritage.short_description_en}</p>

                <div>
                    <p>Tab med Varför prenumerera?</p>
                    <p>Tab med Villkor</p>
                    <p>Tab med Installationsprocess</p>
                </div>

                <hr>
                <div id="checkout-container">
                    <input type="text" id="email" />
                    <div id="email-errors"></div>
                    <div id="payment-element"></div>
                    <button id="pay-button">Pay</button>
                    <div id="confirm-errors"></div>
                </div>

                <form>
                    <input label="Namn"></input>
                    <input label="E-post" type="email"></input>
                    <input label="Telefonnummer"></input>

                    <checkbox>Jag har ett svenskt personnummer</checkbox>
                    <input label="Personnummer" disabled></input>
                </form>

                <form>
                    <input label="Betala med kort" placeholder="Kortnummer"></input>
                    <div>
                        <input placeholder="MM / YY"></input>
                        <input placeholder="CVC"></input>
                    </div>
                </form>

                <button>Betala</button>
            </div>
        </div>
        `

        this.appendChild(template.content.cloneNode(true));
        console.log("RENDER DONE");
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

    async getClientSecret() {
        const response = await fetch("http://127.0.0.1:9001/create-checkout-session", { method: 'POST' });
        const clientSecret = await response.json();
        // console.log("clientSecret:", data);
        return clientSecret
    }

    async initStripeCheckout(clientSecret) {
        console.log("ummmmm");
        
        const stripe = Stripe(
            'pk_test_51TZBpvRfGL28nQKFtwc6eldofWKeQpsJ9ozCVHaVgSXC2WcUNiaDEjzP0hdO53oiZ1Z7eMt2BlUyJePxRZIxwsRx00oK3unykG',
        );

        const checkout = stripe.initCheckoutElementsSdk({clientSecret});

        checkout.on('change', (session) => {
            document.getElementById('pay-button').disabled = !session.canConfirm;
        });

        const loadActionsResult = await checkout.loadActions();

        if (loadActionsResult.type === 'success') {
            const session = loadActionsResult.actions.getSession();
            const checkoutContainer = document.getElementById('checkout-container');

            checkoutContainer.append(JSON.stringify(session.lineItems, null, 2));
            checkoutContainer.append(document.createElement('br'));
            checkoutContainer.append(`Total: ${session.total.total.amount}`);

            const {actions} = loadActionsResult;
            const emailInput = document.getElementById('email');
            const emailErrors = document.getElementById('email-errors');

            emailInput.addEventListener('input', () => {
                // Clear any validation errors
                emailErrors.textContent = '';
            });

            emailInput.addEventListener('blur', () => {
                const newEmail = emailInput.value;
                actions.updateEmail(newEmail).then((result) => {
                    if (result.error) {
                        emailErrors.textContent = result.error.message;
                    }
                });
            });

            const paymentElement = checkout.createPaymentElement();
            paymentElement.mount('#payment-element');

            const button = document.getElementById('pay-button');
            const errors = document.getElementById('confirm-errors');

            button.addEventListener('click', () => {
                // Clear any validation errors
                errors.textContent = '';

                actions.confirm().then((result) => {
                    if (result.type === 'error') {
                        errors.textContent = result.error.message;
                    }
                });
            });
        }
    }
}

customElements.define("world-heritage", WorldHeritage);