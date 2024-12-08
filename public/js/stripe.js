import axios from "axios";
import {showAlert} from "./alerts.js";

const stripe = new Stripe('pk_test_51QTfjqRoHTLxWwk5OE23fQnjpMTQnHxtFBkPOVEBYNA5YEjS62m2E9FYIgTAqVxHcpRzyzNl88804CaKEQyQY8FI00jaXt32CM')

export const bookTour = async (tourId) => {
    try {
        const session = await axios({
            method: 'GET',
            url: 'http://localhost:8001/api/v1/bookings/checkout-session/' + tourId,
        })
        await stripe.redirectToCheckout(
            {sessionId: session.data.session.id}
        )
    } catch (error) {
        console.error(error)
        showAlert("error", error.response.data.message)
    }
}