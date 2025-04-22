"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAccessToken } from "@/app/context/AccessTokenContext";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
const CreateBoard = ({ data }: any) => {
  const { accessToken, setAccessToken } = useAccessToken();
  useEffect(() => {
    const cookies = parseCookies();
    console.log(cookies, "cookies");

    const token = cookies.auth_token;
    console.log(typeof token, "iooioio");

    if (token) {
      setAccessToken(token);
    } else {
      // alert("nothing")
    }
  }, []);
  console.log(accessToken, "accessToken");
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  console.log(uuid, "uuid");
  const [loading1, setLoading1] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state,setState]=useState<any>("")
  // const openModal = () => setIsModalOpen(true);
   const openModal = async()=>{
      try {
        setLoading1(true)
        const response = await fetch(
          "https://dating.goaideme.com/order/create-token",
          {
            // replace '/api/cart' with the correct endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 'Authorization': `Bearer ${gettoken}`
            },
            body: "",
          }
        );
  
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
  
        const data = await response.json(); // Assuming the response returns JSON
        console.log(data,"sdfghjkl;");
        const response1 = await fetch(
          " https://dating.goaideme.com/order/get-products",
          {
            // replace '/api/cart' with the correct endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${data?.data?.access_token}`
            },
            body: "",
          }
        );
  
        // Check if the request was successful
        if (!response1.ok) {
          throw new Error("Failed to add item to cart");
        }
  
        const data1 = await response1.json();
        console.log(data1,"data1");
        setState(data1)
        setIsModalOpen(true);
        // toast.success("Added Successfully", {autoClose:2000});
      } catch (error) {
        setLoading1(false)
      }
    }
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    console.log(cookies, "asdasdasd");
  
    // Finding the 'Auth' cookie
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith("Auth=")
    );
  
    if (authCookie) {
      const cookieValue = authCookie.split("=")[1];
      console.log(cookieValue, "cookieValue");
  
      try {
        const parsedAuthInfo = JSON.parse(decodeURIComponent(cookieValue));
        console.log(parsedAuthInfo, "parsedAuthInfo");
  
        // Extracting the 'uid' from the Auth cookie
        if (parsedAuthInfo && parsedAuthInfo.uid) {
          setUuid(parsedAuthInfo.uid); // Setting the UUID
          console.log("UID:", parsedAuthInfo.uid);
        }
      } catch (error) {
        console.error("Error parsing Auth cookie", error);
      }
    }
  
    // Optionally, you can also extract 'userInfo' cookie if needed
    const userInfoCookie = cookies.find((cookie) =>
      cookie.startsWith("userInfo=")
    );
  
    if (userInfoCookie) {
      const cookieValue = userInfoCookie.split("=")[1];
      console.log(cookieValue, "userInfo cookieValue");
  
      try {
        const parsedUserInfo = JSON.parse(decodeURIComponent(cookieValue));
        setUserInfo(parsedUserInfo);
  
        if (parsedUserInfo && parsedUserInfo.uuid) {
          console.log(parsedUserInfo, "parsedUserInfo");
          setUuid(parsedUserInfo.uuid);
          console.log("UUID from userInfo:", parsedUserInfo.uuid);
        }
      } catch (error) {
        console.error("Error parsing userInfo cookie", error);
      }
    }
  }, []);
  
  const [collectionTitle, setCollectionTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState<any>(false);
  const [addCard, setAddCard] = useState<any>("");
  // State to store other form data
  const [formData, setFormData] = useState({
    selectedGift: "",
  });
  const [brandKeys, setBrandKeys] = useState("");
  console.log(brandKeys,"brandKeys");
  
  // Handle collection title change
  const handleCollectionTitleChange = (e: any) => {
    setCollectionTitle(e.target.value);
  };
  const handleRecipientNameChange = (e: any) => {
    setRecipientName(e.target.value);
  };

  // Handle other form data changes (e.g., selected gift)
  const handleFormDataChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [addSelectedImage, setAddSelectedImage] = useState<any | null>(null);
  const handleBackClick = () => {
    setSelectedImage(null); // Reset the selected image to show the image grid again
  };

  const gettoken = Cookies.get("auth_token");
  const AddGiftCard = () => {
    setAddCard(selectedImage.brandKey); // Reset the selected image to show the image grid again
    console.log("slectedImagedsssssssss", selectedImage);
    setAddSelectedImage(selectGiftImage);
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const handleImageClick = (imageData: any) => {
    setSelectedImage(imageData);
    console.log(imageData, "imageData");
    setBrandKeys(imageData.brand?.brandId);
    setIsModalOpen(true); // Open modal when an image is clicked
  };

  // Handle form submission (you can add your submission logic here)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // const submissionData = {
    //   collectionTitle,
    //   ...formData
    // };

    let item = {
      user_uuid: uuid,
      board_title: collectionTitle,
      board_name: recipientName,
      // gift_card_id:addCard,
      // brandKey:brandKeys,
      // board_name: string
      brand_key: brandKeys
      // user_uuid : string
    };
    console.log(item, "item");

    // router.replace(`/share/${data?.data?.uuid}`)
    // return
    try {
      setLoading(true);
        const response = await fetch(
          "https://dating.goaideme.com/groupboard/add-groupboard",
          {
            // replace '/api/cart' with the correct endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Indicates that you're sending JSON
              Authorization: `Bearer ${gettoken}`,
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify(item),
          }
        );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json(); // Assumin    g the response returns JSON
      if (data.status === 200) {
        toast.success("Added Successfully", {autoClose:2000});
        router.replace(`/card/boardpay/${data?.data?.uuid}`);
      }

      console.log(data, "groupboard");

      // router.replace(`/card/boardpay/1`)
    } catch (error) {
      setLoading(false);
    }
  };
  // const submit=async(e:any)=>{
  //     let item={
  //         user_uuid :"",
  //         collection_title :"",

  //     }
  //     try {
  // const res= await api.Collection.create(item)
  //     } catch (error) {

  //     }
  // }

  const faceValues = selectedImage?.logoUrls[0]; // Filter out undefined or null values

  let minFaceValue: number | undefined;
  let maxFaceValue: number | undefined;

  if (faceValues?.length > 0) {
    minFaceValue = Math.min(...faceValues);
    maxFaceValue = Math.max(...faceValues);

    console.log(`Minimum Face Value: ₹${minFaceValue}`);
    console.log(`Maximum Face Value: ₹${maxFaceValue}`);
  } else {
    console.log("No valid face values found.");
  }
  const selectGiftImage = selectedImage?.logoUrls[0]
  console.log(selectGiftImage, "selectGiftImage");
  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen border border-[#e5e7eb bg-lightBg">
        <h1 className="text-4xl font-bold mb-8">Create a Group Board</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <label className="block mb-6">
            <span className="text-gray-700 text-sm">Who is the board for?</span>
            <input
              type="text"
              value={recipientName}
              onChange={handleRecipientNameChange}
              placeholder="Recipient Name*"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </label>
          <label className="block mb-6">
            <span className="text-gray-700 text-sm">
              What is the title of your board?
            </span>
            <input
              type="text"
              value={collectionTitle}
              onChange={handleCollectionTitleChange}
              placeholder="Board Title *"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </label>
          <div className="mb-6">
            {addSelectedImage === null ? (
              <div className="">
                <h2 className="text-lg font-semibold mb-2">
                  Collect cash for a gift card
                </h2>
                <p className="text-gray-600 mb-2">
                  Make this card extra special. Start a gift card collection pot
                  that anyone can contribute to.
                </p>
                <button
                  type="button"
                  disabled={loading} 
                  className="flex items-center justify-center border border-dashed border-blue-500 bg-blue-50 rounded-md px-4 text-blue-600 font-medium transition duration-300 hover:bg-blue-100"
                  // onClick={() => setFormData({ ...formData, selectedGift: 'gift card' })} // Update the selected gift here
                  onClick={openModal}
                >
                  <span className="text-2xl mr-2">+</span>Select gift card
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {/* <img src={selectGiftImage} alt="" className="" /> */}
                <h2 className="text-center font-bold">Gift Card</h2>
                <img src={addSelectedImage} alt="" className="" />
                <p className="text-center">
                  Everyone will be able to contribute after you finish creating
                  the card.
                </p>
                <button
                  className="text-[#FF0000] hover:text-red-800 font-medium"
                  onClick={() => setAddSelectedImage(null)}
                >
                  Remove Gift Card
                </button>
              </div>
            )}
          </div>
          {/* <Link href={`/share/1`}> */}
          {accessToken ? (
            <button
              //   disabled={setLoading}
              type="submit"
              className="w-full bg-blueBg text-white py-2 px-4  rounded-md hover:bg-blue-700 transition duration-300"
            >
              Continue
            </button>
          ) : (
            <Link href={`/login`}>
              <button
                //   disabled={setLoading}
                type="submit"
                className="w-full bg-blueBg text-white py-2 px-4  rounded-md hover:bg-blue-700 transition duration-300"
              >
                Continue
              </button>
            </Link>
          )}
          {/* <button
            //   disabled={setLoading}
            type="submit"
            className="w-full bg-blueBg text-white py-2 px-4  rounded-md hover:bg-blue-700 transition duration-300"
          >
            Continue
          </button> */}
          {/* </Link> */}
        </form>
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full relative">
              {/* Top-left Cancel Button */}
              <h2 className="text-lg font-semibold mb-2 text-center">
                Select a Gift Card
              </h2>

              <button
                className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                onClick={closeModal}
              >
                X
              </button>

              {/* How Collection Pots Work */}
              <div className="bg-blue-100 p-4 rounded-md mb-2">
                <h3 className="text-sm font-semibold">
                  How do collection pots work?
                </h3>
                <ul className="text-sm text-gray-600 mt-2">
                  <li>1. Add a gift card of choice to the card.</li>
                  <li>2. Anyone can contribute towards the gift card value.</li>
                  <li>
                    3. The recipient instantly claims it when viewing their
                    card.
                  </li>
                </ul>
              </div>

              {/* Conditionally render based on whether an image is selected */}
              {selectedImage ? (
          <div className="flex flex-col items-center">
            <div className="">
              <button className="text-black" onClick={handleBackClick}>Back</button>
            </div>
            <div className="">
              <img src={selectGiftImage} alt="" className="" />
            </div>
            {/* <div className="w-20 h-12 bg-black text-white flex items-center justify-center rounded mb-4">
              {selectedImage.brandName}
            </div> */}
            <h2 className="text-xl font-bold ">{selectedImage.brandName}</h2>
            <p className="text-sm text-gray-500">Country: <span className="font-bold">IND</span></p>
            <p className="text-sm text-gray-500">Currency: <span className="font-bold">INR</span></p>
            <p className="text-sm text-gray-500">Price: <span className="font-bold">{selectedImage?.senderFee}</span></p>

            {/* <p className="text-sm text-gray-500">Min Value: <span className="font-bold">{minFaceValue}</span></p>
            <p className="text-sm text-gray-500">Max Value:<span className="font-bold">{maxFaceValue}</span></p> */}
            {/* <p className="text-sm text-gray-500 text-center mt-2">
              Contribution Fees: <span className="font-bold">{selectedImage.contributionFees}</span>
            </p> */}
            <p className="text-xs text-gray-400 mt-1 text-center">
              (We automatically create multiple gift cards if you go over the max)
            </p>
            <Link
              href="#"
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Terms and conditions
            </Link>
            <button className="bg-blue-600 text-black px-4 py-2 rounded mt-2 hover:bg-blue-700" onClick={AddGiftCard}>
              Add Gift Card
            </button>
          </div>
        ) : (
                <div className="relative">
                  {/* Image Grid */}
                  <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                  {state?.data?.content.map((res: any, index: number) => {
                const imageUrl = res.logoUrls[0]; // You can change this key to any other size if needed

                return (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                    onClick={() => handleImageClick(res)}
                  >
                    <img
                      src={imageUrl}
                      alt={res?.brand?.brandName} // Assuming there's a 'brandName' field in your data
                      className="w-full h-auto object-cover"
                    />
                    <p className="text-center p-2 font-medium">
                      {res?.brand?.brandName}
                    </p>
                  </div>
                );
              })}
                  </div>

                  {/* Optional modal button */}
                  {/* <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                // Trigger modal to show more content
                // Implement modal logic here (e.g., use state to toggle visibility)
              }}
            >
              See All
            </button> */}
                </div>
              )}

              {/* Modal Footer */}
              <p className="text-sm text-gray-500 mt-2 text-center">
                You’ll be taken to our payment provider Stripe to complete the
                payment.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateBoard;
