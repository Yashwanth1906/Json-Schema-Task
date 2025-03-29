import React from 'react';

const NormalContentDisplay: React.FC<{content: string[]}> = ({content}) => { 
  return (
    <div className="normal-content-display">
      <div className="content-box">
        <h2>content</h2>
        <div className="content-text">
          {content.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NormalContentDisplay; 