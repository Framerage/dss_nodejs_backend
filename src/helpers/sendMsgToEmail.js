const nodeMailer = require("nodemailer");

const html = (result) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Decor spirit</title>
      </head>
      <body>
        <header>
          <h1>Thanks for order</h1>
        </header>
        <main>
          <h2>Order successful complete</h2>
          <span class="successMsg">Your total price: 10000rub</span>
          <div id='ordersContainer'>
          ${result}
          </div>
        </main>
      </body>
    </html>`;
};
const createOrdersList = async (products) => {
  const orderItem = [];
  products.map((item, index) => {
    orderItem.push(
      "<span>" +
        (index + 1) +
        ". " +
        item.title +
        "___" +
        item.itemCount +
        " шт" +
        "___" +
        item.price * item.itemCount +
        " rub" +
        "</span><br/>"
    );
  });
  return "<div>" + orderItem.join("") + "</div>";
};
async function sendMsgToEmail(mailTo, orderPrice, products) {
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
  console.log(result, "result");
  await transporter.sendMail({
    from: "DecorSpirit <officialigonin@mail.ru>",
    to: mailTo ? mailTo : "officialigonin@mail.ru",
    subject: `Your order price ${orderPrice}`,
    html: html(result),
  });
  //   console.log("Message sent: " + info.messageId);
  //   console.log(info.accepted);
  //   console.log(info.rejected);
}
module.exports = {
  sendMsgToEmail,
};
