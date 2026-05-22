const stripe = Stripe(
    'pk_test_51TZBpvRfGL28nQKFtwc6eldofWKeQpsJ9ozCVHaVgSXC2WcUNiaDEjzP0hdO53oiZ1Z7eMt2BlUyJePxRZIxwsRx00oK3unykG',
);

async function getClientSecret() {
    const response = await fetch("http://127.0.0.1:9001/create-checkout-session", { method: 'POST' });
    const clientSecret = await response.json();
    // console.log("clientSecret:", data);
    return clientSecret
}

async function main() {
    const clientSecret = await getClientSecret();
    console.log(clientSecret);
    
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
main();