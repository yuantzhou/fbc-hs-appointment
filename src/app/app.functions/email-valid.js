var axios = require("axios");


exports.main = async (context = {}) => {
//     console.log(context.parameters)
//     const emailValidresponse = await axios.get(`https://rapid-email-verifier.fly.dev/api/validate?email=${context.parameters.email}`)
//       console.log(Object.keys(emailValidresponse))
//       console.log(emailValidresponse.data)
// return emailValidresponse.data
const response= await axios.get(`https://emailreputation.abstractapi.com/v1/?api_key=APIKEY&email=${context.parameters.email}`)
                 
      return response.data
}
