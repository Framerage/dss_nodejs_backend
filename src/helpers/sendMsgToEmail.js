const nodeMailer = require("nodemailer");

const html = (products) => {
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
          <div id='ordersContainer'></div>
        </main>
        <script>
        const renderOrder=(${products})=>{
            const container = document.getElementById('ordersContainer')
            products.map((item,index)=>{
                const orderItem=document.createElement('div')
                orderItem.innerText=index+'. '+item.title+'___'+item.price*item.itemCount
                container.push(orderItem)
            })
        }
        renderOrder()
        </script>
      </body>
    </html>`;
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
  console.log(mailTo, "mailTo");
  await transporter.sendMail({
    from: "DecorSpirit <officialigonin@mail.ru>",
    to: mailTo ? mailTo : "officialigonin@mail.ru",
    subject: `Your order price ${orderPrice}`,
    html: html(products),
  });
  //   console.log("Message sent: " + info.messageId);
  //   console.log(info.accepted);
  //   console.log(info.rejected);
}
module.exports = {
  sendMsgToEmail,
};
