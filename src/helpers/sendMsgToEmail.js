const nodeMailer = require("nodemailer");
const emailMsgContainerStyle = `style="
background: linear-gradient(30deg, black, #013535, black);
border: 4px groove aqua;
border-radius: 10px;
padding: 10px;
color: white;
text-shadow: 0 0 5px aqua;
font-weight: 500;
display: flex;
flex-direction: column;
gap:5px;
"`;
const registrationHtml = (clientName, clientPss) => {
  return `
  <div ${emailMsgContainerStyle}
  >
    <h1>Hello, dear ${clientName}</h1>
    <span>Registration completed successfully</span>
    <span>Your choosed pass: ${clientPss}</span>
    </div>
  `;
};
const orderHtml = (result, totalPrice, phone, msgStatus, orderStatus) => {
  if (msgStatus === "create") {
    return `
    <div ${emailMsgContainerStyle}>
    <h1>Thanks for order</h1>
    <h2>Order accepted for processing</h2>
    <span>Your choosed phone: ${phone}</span>
    <span>We will contact you soon</span>
    <span>You ordered: </span>
    ${result}
    <span>Your total price: ${totalPrice} rub</span>
    </div>`;
  }
  if (msgStatus === "delete") {
    return `
    <div ${emailMsgContainerStyle}>
  <h1>Your order is cancelled or deleted</h1>
  <span>You ordered: </span>
  ${result}
  <span>Your total price was: ${totalPrice} rub</span>
  <span>Sorry if we caused you any inconvenience</span>
  </div>
  `;
  }
  if (msgStatus === "statusEdit") {
    return `
    <div ${emailMsgContainerStyle}>
  <h1>Status of your order is changed on "${orderStatus}"</h1>
  <span>Your phone was ${phone}. If it's not your phone, please contact with us</span>
  <span>You ordered: </span>
  ${result}
  <span>Your total price was: ${totalPrice} rub</span>
  </div>
    `;
  }
  return "Any error";
};
const createOrdersList = async (products) => {
  const orderItem = [];
  products.map((item, index) => {
    orderItem.push(
      "<span style='font-size: 16px; padding: 5px 10px'>" +
        (index + 1) +
        ". " +
        item.title +
        "___" +
        " x" +
        item.itemCount +
        " ___" +
        item.price * item.itemCount +
        " rub" +
        "</span><br/>"
    );
  });
  return "<div>" + orderItem.join("") + "</div>";
};
const adminEmail = process.env.ADMIN_EMAIL;
const checkMsgStatus = (msg, orderNumber) => {
  if (msg === "create") {
    return `Your order #${orderNumber} accepted`;
  }
  if (msg === "delete") {
    return `Your order #${orderNumber} cancelled/deleted`;
  }
  if (msg === "statusEdit") {
    return `Your order #${orderNumber} changed`;
  }
  if (msg === "registration") {
    return "Registration completed";
  }
  return "Error msg";
};
async function sendMsgToEmail(
  mailTo,
  orderPriceOrClienName,
  products,
  phone,
  msgStatus,
  orderStatusOrClientPass
) {
  const transporter = nodeMailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: adminEmail,
      pass: process.env.MAIL_EXTRA_PASS,
    },
  });
  const result = await createOrdersList(products);
  await transporter.sendMail({
    from: ` DecorSpirit <${adminEmail}>`,
    to: mailTo ? mailTo : adminEmail,
    subject: mailTo ? checkMsgStatus(msgStatus, 101) : `Error with email msg #`,
    html:
      msgStatus === "registration"
        ? registrationHtml(orderPriceOrClienName, orderStatusOrClientPass)
        : orderHtml(
            result,
            orderPriceOrClienName,
            phone,
            msgStatus,
            orderStatusOrClientPass
          ),
  });
}
module.exports = {
  sendMsgToEmail,
};
