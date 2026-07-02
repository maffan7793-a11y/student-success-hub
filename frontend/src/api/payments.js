import api from "./axios";

export const createOrder = (applicationId) =>
  api.post("/payments/create-order", { application_id: applicationId }).then((r) => r.data);

export const verifyPayment = (payload) => api.post("/payments/verify", payload).then((r) => r.data);

/**
 * Loads the Razorpay Checkout script (if not already present) and opens
 * the payment modal. Resolves with the verified application on success.
 */
export function openRazorpayCheckout({ order, student, onSuccess, onFailure }) {
  const launch = () => {
    const rzp = new window.Razorpay({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Student Success Hub",
      description: "Virtual Internship Program - ₹79",
      order_id: order.order_id,
      prefill: {
        name: student?.full_name,
        email: student?.email,
        contact: student?.phone,
      },
      theme: { color: "#7C3AED" },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          onSuccess?.(result);
        } catch (err) {
          onFailure?.(err);
        }
      },
      modal: {
        ondismiss: () => onFailure?.(new Error("Payment cancelled")),
      },
    });
    rzp.open();
  };

  if (window.Razorpay) {
    launch();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = launch;
  script.onerror = () => onFailure?.(new Error("Failed to load Razorpay checkout"));
  document.body.appendChild(script);
}
