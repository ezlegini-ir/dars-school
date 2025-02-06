import ZarinPal from "zarinpal-node-sdk";

export const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHENT_ID,
  sandbox: true,
});

export async function initiatePayment() {
  try {
    const res = await zarinpal.payments.create({
      amount: 10000,
      callback_url: "http://localhost:3000/test",
      description: "test",
      mobile: "09127452859",
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
