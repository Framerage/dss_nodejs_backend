const nodeMailer = require("nodemailer");

const html = (result, totalPrice, phone, orderStatus) => {
  if (orderStatus === "create") {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Decor spirit</title>
      </head>
      <body>
    <div style="
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
  ">
    <h1>Thanks for order</h1>
    <h2>Order accepted for processing</h2>
    <span>Your choosed phone: ${phone}</span>
    <span>We will contact you soon</span>
    <span>You ordered: </span>
    ${result}
    <span>Your total price: ${totalPrice} rub</span>
    </div>
      </body>
    </html>`;
  }
  return "Your order is cancelled/deleted";
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
async function sendMsgToEmail(
  mailTo,
  orderPrice,
  products,
  phone,
  orderStatus
) {
  const transporter = nodeMailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "officialigonin@mail.ru",
      pass: process.env.MAIL_EXTRA_PASS,
    },
  });
  const result = await createOrdersList(products);
  await transporter.sendMail({
    from: "DecorSpirit <officialigonin@mail.ru>",
    to: mailTo ? mailTo : "officialigonin@mail.ru",
    subject: mailTo ? `Your order price #${orderPrice}` : `Error with order #`,
    html: html(result, orderPrice, phone, orderStatus),
  });
}
module.exports = {
  sendMsgToEmail,
};
