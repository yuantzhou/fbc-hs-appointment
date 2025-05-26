const hubspot = require('@hubspot/api-client');
var axios = require("axios");

exports.main = async (context = {}) => {
  console.log(context.parameters)
  if(context.parameters.TimeZone!="This Host Doesn't a Time Zone Configured"&&context.parameters.TimeZone){
  if(context.parameters.monthOffset){
    if (context.parameters.Host){
      //console.log(context.parameters.Host)
      //context.parameter= {context {browser default} ,Host{id, properties{} }} 
      
      let response = await axios.get
  (`https://api.hubapi.com/scheduler/v3/meetings/meeting-links?organizerUserId=${context.parameters.Host.properties.hs_internal_user_id}`, 
          {
          headers: {
            "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
          }
        });
        if(response.data.total==0){
          return "calendar not connected"
        }
        
        return getAvailablility(response.data.results[0].slug)
    async function getAvailablility(slug){
      let response = await axios.get(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?timezone=${context.parameters.TimeZone}&monthOffset=${context.parameters.monthOffset}`, 
      {
      headers: {
        "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
      }
    });
    return {response:response.data, slug:slug}
    }
    }else{
  let response = await axios.get
  (`https://api.hubapi.com/scheduler/v3/meetings/meeting-links?organizerUserId=${context.parameters.context.user.id}`, 
          {
          headers: {
            "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
          }
        });
    return getAvailablility(response.data.results[0].slug)
    async function getAvailablility(slug){
      let response = await axios.get(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?timezone=${context.parameters.TimeZone}&monthOffset=${context.parameters.monthOffset}`, 
      {
      headers: {
        "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
      }
    });
    return {response:response.data, slug:slug}
    }
  }

  }else{
  if (context.parameters.Host){
    //console.log(context.parameters.Host)
    //context.parameter= {context {browser default} ,Host{id, properties{} }} 
    
    let response = await axios.get
(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links?organizerUserId=${context.parameters.Host.properties.hs_internal_user_id}`, 
        {
        headers: {
          "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
        }
      });
      if(response.data.total==0){
        return "calendar not connected"
      }
      
      return getAvailablility(response.data.results[0].slug)
  async function getAvailablility(slug){
    let response = await axios.get(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?timezone=${context.parameters.TimeZone}`, 
    {
    headers: {
      "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
    }
  });
  return {response:response.data, slug:slug}
  }
  }else{
let response = await axios.get
(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links?organizerUserId=${context.parameters.context.user.id}`, 
        {
        headers: {
          "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
        }
      });
  return getAvailablility(response.data.results[0].slug)
  async function getAvailablility(slug){
    let response = await axios.get(`https://api.hubapi.com/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?timezone=${context.parameters.TimeZone}`, 
    {
    headers: {
      "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
    }
  });
  return {response:response.data, slug:slug}
  }
}
}
}else{
  console.log("timeZone = null")
  console.log(context.parameters.TimeZone)
  return "TimeZone not connected"
}
}