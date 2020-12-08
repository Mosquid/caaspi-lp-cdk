const captcha = require("./captcha")
const subscriber = require("./subscriber")
const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

exports.main = async function (event, context) {
  try {
    var method = event.httpMethod

    if (method === "POST") {
      const body = JSON.parse(event.body)
      const { captchaResponse, ...rest } = body
      const isCaptchaValid =
        captchaResponse && (await captcha.verify(captchaResponse))

      if (!isCaptchaValid) throw new Error("Captcha response is invalid")

      const user = await subscriber.create(rest)

      if (!user) throw new Error("Failed creating a user")

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(user),
      }
    }

    return {
      statusCode: 400,
      headers,
      body: "We only accept POST /",
    }
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify(body),
    }
  }
}
