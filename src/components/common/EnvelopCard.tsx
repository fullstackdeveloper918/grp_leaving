"use client"
import React, { useState } from 'react';

const EnvelopCard = () => {
  const [recipient, setRecipient] = useState('John Doe');
  const [message, setMessage] = useState('You have a new greeting card!');
  const [image, setImage] = useState('https://groupleavingcards.com/assets/design/66bd382d51e4bce9bdd31fc6_sm.avif');
  const [isOpen, setIsOpen] = useState(false);

  const toggleEnvelope = () => {
    setIsOpen(!isOpen);
  };

  // Inline Styles
  const envelopeContainerStyle = {
    position: 'relative',
    width: '300px',
    height: '200px',
    margin: '30px auto',
    perspective: '1000px', // Creates the 3D effect
  }as any;

  const envelopeCardStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    transition: 'transform 1s ease-out', // Envelope flip transition
    transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)', // Envelope flip
  }as any;

  const envelopeSideStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden', // Hide the back when flipped
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }as any;

  const envelopeFrontStyle = {
    backgroundColor: '#f7f7f7',
    border: '2px solid #ccc',
    borderRadius: '10px',
    boxSizing: 'border-box',
  };

  const envelopeBackStyle = {
    backgroundColor: '#fff',
    transform: 'rotateY(180deg)', // Start with the back side facing
    padding: '20px',
    boxSizing: 'border-box',
  };

  const cardContentStyle = {
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    borderRadius: '10px',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)', // Card slide-up effect
    opacity: isOpen ? '1' : '0',
    transition: 'transform 1s ease-out, opacity 1s ease-out', // Slide and fade-in transition
  }as any;

  const h3Style = {
    fontSize: '24px',
    marginBottom: '10px',
  };

  const pStyle = {
    fontSize: '16px',
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>Green Envelope Preview</h2>

      {/* Form to customize preview */}
      <div style={{ marginBottom: '20px' }}>
        <label>Recipient:</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ margin: '0 10px', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ margin: '0 10px', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Image URL:</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ margin: '0 10px', padding: '5px' }}
        />
      </div>

      {/* Envelope and card container */}
      <div style={envelopeContainerStyle} onClick={toggleEnvelope}>
        <div style={envelopeCardStyle}>
          {/* Envelope Front */}
          <div style={{ ...envelopeSideStyle, ...envelopeFrontStyle }}>
            <h3>Click to Open</h3>
          </div>

          {/* Envelope Back (Card Inside) */}
          <div style={{ ...envelopeSideStyle, ...envelopeBackStyle }}>
            <div style={cardContentStyle}>
              <h3 style={h3Style}>{recipient}</h3>
              <p style={pStyle}>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvelopCard;
