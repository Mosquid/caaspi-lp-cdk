const CAPTCHA_SERVER = process.env.CAPTCHA_SERVER || ""
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || ""
const axios = require("axios")

module.exports.verify = async (captchaResponse) => {
  if (!CAPTCHA_SERVER || !CAPTCHA_SECRET) return false

  try {
    const resp = await axios.post(CAPTCHA_SERVER, {
      response: captchaResponse,
      secret: CAPTCHA_SECRET,
    })

    return resp
  } catch (error) {
    console.log(error)
    return false
  }
}
