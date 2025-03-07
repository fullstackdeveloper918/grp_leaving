"use client"
import React, { useState } from "react";
import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/solid";

const SuccessPage: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState<string>("");

  const handleCopy = () => {
    navigator.clipboard.writeText("https://groupcavingcards.com/share/qYqQpxgX810")
      .then(() => {
        setCopySuccess("Link copied successfully!");
        setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      })
      .catch(() => {
        setCopySuccess("Failed to copy the link.");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  return (
    <div className="success-container">
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
              value="https://groupcavingcards.com/share/qYqQpxgX810"
              className="shareable-input"
            />
            <button onClick={handleCopy} className="copy-button">
              <ClipboardIcon className="clipboard-icon" />
            </button>
          </div>
          {copySuccess && <p className="copy-success-message">{copySuccess}</p>}
        </div>

        {/* Buttons */}
        <div className="button-container">
          <button className="view-receipt-button">View Receipt</button>
          <button className="sign-card-button">Sign Card</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
