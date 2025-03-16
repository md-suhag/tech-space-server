const { default: axios } = require("axios");
const { ssl_commerz } = require("../config");

async function verifyPayment(paymentData) {
  const verificationData = {
    store_id: ssl_commerz.store_id,
    store_passwd: ssl_commerz.store_passwd,
    tran_id: paymentData.tran_id,
  };

  try {
    const response = await axios.post(
      `${ssl_commerz.api_url}/payment/verify`,
      verificationData
    );

    if (response.data.status === "VALID") {
      return true;
    } else {
      console.error("Payment verification failed");
      return false;
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
}

module.exports = verifyPayment;
