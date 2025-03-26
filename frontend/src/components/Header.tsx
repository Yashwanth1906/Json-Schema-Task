import React from 'react';

interface HeaderProps {
  docLink: string;
  setDocLink: (value: string) => void;
  onGetDetails: () => void;
  onModifyDocs: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  docLink,
  setDocLink,
  onGetDetails,
  onModifyDocs,
  loading
}) => {
  return (
    <div className="header-section">
      <h1>Google Docs API Interface</h1>
      <div className="input-section">
        <input
          type="text"
          value={docLink}
          onChange={(e) => setDocLink(e.target.value)}
          placeholder="Enter Google Doc Link"
          className="doc-link-input"
        />
        <div className="button-group">
          <button onClick={onGetDetails} disabled={loading}>
            Get Details
          </button>
          <button onClick={onModifyDocs} disabled={loading}>
            Modify Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header; 