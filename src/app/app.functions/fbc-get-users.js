var axios = require("axios");

//api.hubapi.com/crm/v3/objects/users?limit=100&properties=hs_internal_user_id&properties=hs_searchable_calculated_name&properties=hs_email&properties=hs_standard_time_zone&archived=false
exports.main = async (context = {}) => {   
    const AllUsers=[]
    let after=0
    do{
let response = await axios.get
(`https://api.hubapi.com/crm/v3/objects/users?limit=100&after=${after}&properties=hs_internal_user_id&properties=hs_searchable_calculated_name&properties=hs_email&properties=hs_standard_time_zone&archived=false`, 
        {
        headers: {
          "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
        }
      });
      AllUsers.push(...response.data.results)
      console.log(response.data.paging)
      console.log(after)
      if(response.data.paging){
        after= response.data.paging.next.after
      }
      else{
        after=17
      }
    }
while(after!=17)
return AllUsers  

}
