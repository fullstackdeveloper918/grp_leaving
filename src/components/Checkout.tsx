"use client";
import React, { useEffect, useState } from "react";
import GooglePay from "./common/GooglePay";
import { CardElement, useStripe } from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Grid,
  Input,
  Popover,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import AddCardElement from "./common/AddCard";
import RazorPay from "./RazorPay";
import EscrowPayment from "./EscrowPayment";
import { cookies } from "next/headers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const Checkout = ({ data }: any) => {
  const router = useRouter();
  const [bundledata, setBundledata] = useState<any>([]);
  const [cardType, setCardType] = useState<any>("group");
  console.log(cardType, "cardType");
  const param = useParams();
  const query: any = useSearchParams();
  const cartUuid = query.get("cart_uuid");
  console.log(cartUuid, "cartUuid");

  console.log(param.id, "param");
  console.log(data, "datadatadata");
  const product_id = param.id;
  console.log(product_id, "asdas");
  const gettoken = Cookies.get("auth_token");

  // const cookiesList = cookies();
  // const userInfoCookie = cookiesList.get('userInfo');
  // console.log(userInfoCookie,"ppppp");
  // let userInfo = null;
  // if (userInfoCookie) {
  //   try {
  //     userInfo = JSON.parse(userInfoCookie.value);
  //   } catch (error) {
  //     console.error("Error parsing userInfo cookie", error);
  //   }
  // }
  // console.log(userInfo,"pooooo");

  const [bundleOption, setBundleOption] = useState<any>("single");
  const [numCards, setNumCards] = useState<any>(null);
  console.log(bundleOption, "bundleOptionqqqqqq");

  // State to store the selected sale price
  const [salePrice, setSalePrice] = useState("22.45");
  const [exact, setExact] = useState<any>("");
  const [selectBundle, setSelectBundle] = useState<any>("");

  // const [state, setState]=useState<any>("")
  // Handle selection change
  console.log(selectBundle?.uuid, "selectBundle");
  const handleChange = (e: any) => {
    console.log(e, "lklkl");
    handleApplyBundleId();
    const selectedCount = data?.data.find(
      (count: any) => count.number_of_cards === Number(e.target.value)
    );
    setNumCards(Number(e.target.value)); // Update number of cards state
    console.log(selectedCount, "selectedCount");
    setSelectBundle(selectedCount);
    console.log(e, "lklkl");
    if (selectedCount) {
      setSalePrice(selectedCount.sale_price); // Update sale price state
      setExact(selectedCount.cost_price);
    }
  };
  const [paywith, setPaywith] = useState<any>("STRIPE");
  const [voucher, setVaoucher] = useState<any>("");
  const [voucherDiscount, setVaoucherDiscount] = useState<any>("");
  console.log(numCards, "numCards");
  console.log(salePrice, "salePrice");
  console.log(bundleOption, "bundleOption");

  const onChange = (e: any) => {
    setVaoucher(e);
  };

  const stripe = useStripe();
  const cardPrices: any = {
    5: { price: 22.45, perCard: 4.49, discount: "10%" },
    10: { price: 40.9, perCard: 4.09, discount: "18%" },
    20: { price: 73.8, perCard: 3.69, discount: "26%" },
  };
  const groupCardPrice = 4.99;
  const individualCardprice = 2.55;
  const bundleSingleCard = 4.99;
  const screens = Grid.useBreakpoint();

  const AmountCondition =
    cardType === "group"
      ? groupCardPrice
      : cardType === "individual"
      ? individualCardprice
      : bundleSingleCard;

  const amount: any =
    cardType === "individual"
      ? individualCardprice
      : cardType === "group"
      ? bundleOption === "single"
        ? bundleSingleCard
        : salePrice
      : "22.45";

  const TotalAmount = amount - voucherDiscount;
  // const TotalAmount = bundleOption === "single"
  // ? bundleSingleCard
  // : cardType === "group"
  // ? groupCardPrice
  // : cardType === "individual"
  // ? individualCardprice
  // : salePrice;
  // bundleOption === "bundle"
  //   ? `$${parseFloat(cardPrices[numCards].price.toFixed(2)) - voucher1} USD`
  //   : `$${AmountCondition - voucher1} USD`;
  console.log(amount, "amount");

  const handleApplyDiscount = async () => {
    console.log("object");
    // setVaoucher1(voucher);
    try {
      const requestData = {
        code: voucher,
        card_price: amount,
        // full_name:name,
        // additional_invoice:invoiceDetails
      };

      let res = await fetch(
        "https://dating.goaideme.com/discount/is-voucher-valid",
        {
          method: "POST", // Method set to POST
          headers: {
            "Content-Type": "application/json", // Indicates that you're sending JSON
            Authorization: `Bearer ${gettoken}`, // Send the token in the Authorization header
          },
          body: JSON.stringify(requestData), // Stringify the data you want to send in the body
        }
      );

      // Parse the response JSON
      let posts = await res.json();
      console.log(posts, "jklklkj");
      const numberValue = parseFloat(posts?.data.replace(/[^0-9.]/g, ""));
      setVaoucherDiscount(numberValue);
      // console.log("voucher discount", voucherDiscount);
      if (res.status === 200) {
        toast.success("Voucher Added Suceesfully", { autoClose: 2000 });
      } else if (posts?.statusCode === 401) {
        Cookies.remove("auth_token");
        router.replace("/login");
        window.location.reload();
      }
    } catch (error: any) {
      toast.error("Voucher is not found", { autoClose: 3000 });
    }
  };
  const handleApplyBundleId = async () => {
    console.log("object");
    // setVaoucher1(voucher);
    try {
      const requestData = {
        bundle_uuid: bundledata?.data[0]?.product_id,
      };

      let res = await fetch(
        "https://dating.goaideme.com/card/purchase-bundle-counasst",
        {
          method: "POST", // Method set to POST
          headers: {
            "Content-Type": "application/json", // Indicates that you're sending JSON
            Authorization: `Bearer ${gettoken}`, // Send the token in the Authorization header
          },
          body: JSON.stringify(requestData), // Stringify the data you want to send in the body
        }
      );

      // Parse the response JSON
      let posts = await res.json();
      console.log(posts, "jklklkj");
    } catch (error: any) {
      // toast.error("Voucher is not found", { autoClose: 3000 });
    }
  };
  const handlePaymentCardBundle = async () => {
    console.log("Button clicked"); // Check if button click triggers the function
    if (!bundledata?.data[0]?.product_id || !product_id) {
      console.error("Missing product_id or bundledata");
      return; // Exit early if critical data is missing
    }
    try {
      const requestData = {
        bundle_uuid: bundledata?.data[0]?.product_id,
        card_uuid: product_id,
        cart_uuid: cartUuid,
      };
      console.log(requestData, "requestData");

      // Add cache control headers and random query string to prevent caching
      const url = "https://dating.goaideme.com/card/purchase-bundle-count"; // Adding timestamp to avoid caching

      let res = await fetch(url, {
        method: "POST", // Method set to POST
        headers: {
          "Content-Type": "application/json", // Indicates that you're sending JSON
          Authorization: `Bearer ${gettoken}`, // Send the token in the Authorization header
          "Cache-Control": "no-cache", // Ensure no caching
        },
        body: JSON.stringify(requestData), // Stringify the data you want to send in the body
      });

      // Parse the response JSON
      let posts = await res.json();
      console.log(posts, "Response Data"); // Log the response data to check for success

      if (posts?.status == 200) {
        // console.log("Payment successful!");
        toast.success("payment successful", { autoClose: 2000 });
        router.push(`/successfull?unique_id=${posts?.data}`);
      } else {
        console.log("Payment failed:", posts?.message);
      }
    } catch (error) {
      console.error("API request failed", error); // Log the error
      // You can also use a toast or any other notification here to show an error message
    }
  };

  const getBundledata = async () => {
    try {
      let res = await fetch(
        "https://dating.goaideme.com/razorpay/puchased-bundle-array",
        {
          method: "GET", // Method set to POST
          headers: {
            "Content-Type": "application/json", // Indicates that you're sending JSON
            Authorization: `Bearer ${gettoken}`, // Send the token in the Authorization header
          },
          // body: JSON.stringify(requestData) // Stringify the data you want to send in the body
        }
      );

      // Parse the response JSON
      let posts = await res.json();
      setBundledata(posts);
      console.log(posts, "hkhkh");
    } catch (error) {}
  };

  useEffect(() => {
    getBundledata();
  }, []);
  const [quantity, setQuantity] = useState<any>(0);
  // const quantity:any = 10;
  console.log(quantity, "quantity");

  let currentToastId: any = null;
  // https://dating.goaideme.com/card/bundle-quantity-total-count
  const handleRadioChange = async () => {
    try {
      // if (quantity > 0) {
      // If a toast is already showing, dismiss it
      if (currentToastId !== null) {
        toast.dismiss(currentToastId);
      }
      let res = await fetch(
        "https://dating.goaideme.com/card/bundle-quantity-total-count",
        {
          method: "GET", // Method set to POST
          headers: {
            "Content-Type": "application/json", // Indicates that you're sending JSON
            Authorization: `Bearer ${gettoken}`, // Send the token in the Authorization header
          },
          // body: JSON.stringify(requestData) // Stringify the data you want to send in the body
        }
      );

      // Parse the response JSON
      let posts = await res.json();
      // setBundledata(posts)
      console.log(posts, "sriweyryertty");
      setQuantity(posts?.message);
      // message
      // Show the warning toast and save the toast ID
      if (quantity > 0) {
        currentToastId = toast.warning(
          `Remaining Card Purchase Quantity: ${quantity}`
        );
      }
      // currentToastId = toast.warning(`Remaining quantity: ${quantity}`);

      if (quantity === 0) {
        setBundleOption("bundle");
      }
    } catch (error) {}
  };

  // useEffect(()=>{

  // })
  console.log("voucher discount", voucherDiscount);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-5">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:flex">
        {/* Left Section */}
        <div className="flex-1">
          {/* Card Type Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Card Type</h2>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cardType"
                  value="group"
                  checked={cardType === "group"}
                  onChange={() => setCardType("group")}
                  className="mr-2"
                />
                <span className="text-lg">Group Card</span>
                <span className="ml-auto text-gray-500">
                  ${groupCardPrice} USD
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cardType"
                  value="individual"
                  checked={cardType === "individual"}
                  onChange={() => setCardType("individual")}
                  className="mr-2"
                />
                <span className="text-lg">Individual Card</span>
                <span className="ml-auto text-gray-500">
                  ${individualCardprice} USD
                </span>
              </label>
            </div>
          </div>
          {cardType !== "individual" ? (
            <>
              {/* Bundle Discount Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Bundle Discount</h2>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bundleOption"
                      value="single"
                      checked={bundleOption === "single"}
                      onChange={() => setBundleOption("single")}
                      className="mr-2"
                    />
                    <span className="text-lg">Single Card</span>
                    <span className="ml-auto text-gray-500">
                      ${bundleSingleCard} USD
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bundleOption"
                      value="bundle"
                      checked={bundleOption === "bundle"}
                      // onChange={() => setBundleOption("bundle")}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    <span className="text-lg">Card Bundle</span>
                    <span className="ml-auto text-green-500">
                      From ${data?.data[0].sale_price} USD
                      {/* From $22.45 USD */}
                    </span>
                  </label>
                </div>

                {bundleOption === "bundle" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                    <ul className="text-green-600 mb-4 space-y-1">
                      <li>💰 Save up to 40% by buying a bundle</li>
                      <li>🤝 Share bundle with colleagues</li>
                      <li>🕑 No Expiry. No Subscription.</li>
                      <li>🧾 File a single expense claim</li>
                    </ul>

                    <div className="flex flex-col space-y-2">
                      <label className="font-bold text-gray-700">
                        Select number of cards:
                      </label>
                      <select
                        // value={numCards}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                      >
                        {data?.data.map((count: any) => (
                          // console.log(count,"count")

                          <option
                            key={count.number_of_cards}
                            value={count.number_of_cards}
                          >
                            {count?.number_of_cards} Cards — $
                            {count.sale_price.toFixed(2)} USD ($
                            {count.per_card.toFixed(2)} USD/card) -{" "}
                            {count.discount} off
                          </option>
                        ))}
                      </select>
                      <p className="text-gray-600 text-sm mt-2">
                        After buying this bundle and card, you will have{" "}
                        {numCards - 1} cards left to use any time.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            "This is a 1-1 card. Group signing will be disabled and only you will be able to add messages.Please select Group Card if you want to collect messages from others and receive a share URL."
          )}

          {/* Payment Options */}
          <div className="space-y-4">
            {/* <a href="/card/checkout/1">
            </a> */}
            <>
            {console.log(bundleOption,"qweqweqw")}
            </>
            {quantity === 0 ? (
              <>
                <RazorPay
                  amount={TotalAmount}
                  cart_id={query.cart_uuid}
                  type={bundleOption}
                  
                  bundleId={selectBundle?.uuid}
                />
                {/* {console.log(bundleOption,"123123rwe")} */}
              </>
            ) : (
              <button
                className="mt-6 bg-blue-600 text-blueText w-full py-2 rounded-xl border-2 border-[blueText] hover:bg-blue-700"
                onClick={handlePaymentCardBundle}
              >
                Pay with Bundle
              </button>
            )}
            {/* <EscrowPayment/> */}
            {/* <CardElement />
            <GooglePay
              totalPrice={"1.00"}
              currencyCode="AUD"
              countryCode="AU"
              // handleSocialBuy={props.handleSocialBuy}
            /> */}
          </div>
        </div>

        <div className="flex-1 mt-6 md:mt-0 md:ml-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Your Card</h2>
            <div className="flex justify-between items-center mb-4">
              <span>Group Card for TRYRT</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Voucher Code"
                className="border border-gray-300 rounded-lg p-2 w-full"
                onChange={(e: any) => onChange(e.target.value)}
                value={voucher}
              />
              <button
                onClick={handleApplyDiscount}
                className="ml-2 bg-blue-500 text-black  border-2 border-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Apply
              </button>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between">
                <span>Card Price</span>
                <span className="font-bold">
                  {/* {bundleOption === "bundle"
                    ? `$${
                        parseFloat(cardPrices[numCards].price.toFixed(2)) -
                        voucher1
                      } USD`
                    : `$${AmountCondition - voucher1} USD`} */}
                  {`$${exact - voucherDiscount} USD`}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Total</span>
                <span className="font-bold text-xl">
                  {`$${TotalAmount} USD`}
                  {/* {bundleOption === "bundle"
                    ? `$${
                        parseFloat(cardPrices[numCards].price.toFixed(2)) -
                        voucher1
                      } USD`
                    : `$${AmountCondition - voucher1} USD`} */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
