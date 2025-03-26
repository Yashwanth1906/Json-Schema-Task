import React from 'react';

const NormalContentDisplay: React.FC<{content: string[]}> = ({content}) => { 
  return (
    <div className="normal-content-display">
      <div className="content-box">
        <h3>Content</h3>
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