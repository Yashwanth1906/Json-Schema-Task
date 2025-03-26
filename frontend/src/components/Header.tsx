import React from 'react';

interface HeaderProps {
  docLink: string;
  setDocLink: (link: string) => void;
  onGetDetails: () => void;
  onModifyDocs: () => void;
  loading: boolean; 
  docsLinkUpdated: boolean;
  setDocsLink: (link: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  docLink,
  setDocLink,
  onGetDetails,
  onModifyDocs,
  loading,
  docsLinkUpdated,
  setDocsLink
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docLink.trim()) {
      setDocLink(docLink.trim());
    }
  };

  return (
    <div className="header">
      <h1>JSON Schema Task</h1>
      {!docsLinkUpdated ? (
        <form onSubmit={handleSubmit} className="doc-link-form">
          <input
            type="text"
            className="doc-link-input"
            placeholder="Enter Google Doc Link"
            value={docLink}
            onChange={(e) => setDocLink(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} onClick={() => setDocsLink(docLink)}>
            Set Doc Link
          </button>
        </form>
      ) : (
        <div className="button-group">
          <button onClick={onGetDetails} disabled={loading}>
            Get Details
          </button>
          <button onClick={onModifyDocs} disabled={loading}>
            Modify Docs
          </button>
        </div>
      )}
    </div>
  );
};

export default Header; 