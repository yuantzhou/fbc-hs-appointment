var axios = require("axios");

exports.main = async (context = {}) => {
    console.log(context.parameters)
    const response = await axios.post(
        'https://api.hubapi.com/scheduler/v3/meetings/meeting-links/book',
        context.parameters.bookingInfo,
        {
          headers: {
            "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`,
            'content-type': 'application/json'
          }
        }
      );
      console.log(Object.keys(response))
      console.log(response.data)
return response
}