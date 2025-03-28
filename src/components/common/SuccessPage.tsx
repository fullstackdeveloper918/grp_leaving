"use client"
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

const SuccessPage = () => {
  // const [copySuccess, setCopySuccess] = useState<string>("");
const searchParams = useSearchParams(); // Access the search params
console.log(searchParams,"searchParams");

const [paymentId, setPaymentId] = useState<string | null>(null);
console.log(paymentId,"paymentId");
useEffect(() => {
  // Extract the 'id' query parameter
  const id = searchParams.get("unique_id"); // Get the 'id' parameter
  console.log(id,"uououio");
  
  if (id) {
    setPaymentId(id); // Set the value of the query parameter
  }
}, [searchParams])
  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/share/editor/${paymentId}`)
      .then(() => {
        toast.success("Link copied successfully")
        // setCopySuccess("Link copied successfully!");
        // setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      })
      .catch(() => {
        // setCopySuccess("Failed to copy the link.");
        // setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  return (
    <div className="success-container">
      <ToastContainer/>
      <div className="success-card">
        {/* Steps */}
        <div className="steps-container">
          <div className="step">
            <div className="step-circle">1</div>
            <span className="step-label">Pick a Design</span>
          </div>
          <div className="step">
            <div className="step-circle">2</div>
            <span className="step-label">Enter Details</span>
          </div>
          <div className="step">
            <div className="step-circle">3</div>
            <span className="step-label">Pay and Share</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-message">
          <CheckCircleIcon className="success-icon" />
          <h1 className="success-title">Success!</h1>
          <p className="success-description">
            Thanks for your payment, we’ve created your card and it’s ready to be signed
          </p>
        </div>

        {/* Shareable Link */}
        <div className="shareable-link-container">
          <label className="shareable-label">
            Share the link with friends or colleagues so they can add their own messages:
          </label>
          <div className="shareable-input-container">
            <input
              type="text"
              readOnly
              value={`http://localhost:3000/share/editor/${paymentId}`}
              // value={`https://groupcavingcards.com/share/${paymentId}`}
              className="shareable-input"
            />
            <button onClick={handleCopy} className="copy-button">
              <ClipboardIcon className="clipboard-icon" />
            </button>
          </div>
          {/* {copySuccess && <p className="copy-success-message">{copySuccess}</p>} */}
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button className="view-receipt-button">View Receipt</button>
          <Link href={`/share/editor/${paymentId}`}>
          <button className="sign-card-button">Sign Card</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
