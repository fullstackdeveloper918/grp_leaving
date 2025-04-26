import CardEditor from '@/components/common/CardEditor'
import React from 'react'

const page = async(params:any) => {
  const id = params?.params?.id;
  console.log(id,"hsjkhajkshd");
  
  const response = await fetch(`https://dating.goaideme.com/card/edit-messages-by-unique-id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${authToken}`, // Add authToken if needed
    },

  });

  const data = await response.json();
  console.log(data, "responseData");
  return (
    <div><CardEditor slideData={data}/></div>
  )
}

export default page