"use client"
import React, { useEffect, useState } from 'react'
import EditorModal from './EditorModal'
import Custom from './custom'
import CustomEditior from './CustomEditior'
import { useParams } from 'next/navigation'

const CardEditor = ({slideData}:any) => {

   const { id } = useParams(); 
  const [responseData, setResponseData] = useState<any>([]);
  console.log(responseData,"responseData");
  
     useEffect(() => {
        if (id) {
          const fetchData = async () => {
            try {
              const response = await fetch(
                `https://dating.goaideme.com/card/edit-messages-by-unique-id/${id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
    
              const data = await response.json();
              setResponseData(data); // Store response data in state
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
    
          fetchData();
        }
      }, []);
  return (
    <div>
    {/* <EditorModal /> */}
     <Custom slideData={slideData}/>
     {/* <Custom slideData={slideData}/> */}
     {/* <CustomEditior /> */}
     </div>
  )
}

export default CardEditor