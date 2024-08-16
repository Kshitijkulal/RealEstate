import React, { useState } from 'react';

const OTPInput = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (element, index) => {
    if (!/^[0-9]$/.test(element.value)) return; // Allow only numeric input
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move to next input field
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index !== 0 && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      onChange(newOtp.join(''));
      e.target.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length).split('');
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (/^[0-9]$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          style={{
            width: '40px',
            height: '40px',
            margin: '0 5px',
            textAlign: 'center',
            fontSize: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
