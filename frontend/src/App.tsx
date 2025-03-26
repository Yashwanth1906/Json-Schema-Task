import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import WriteOptions from './components/WriteOptions'
import Sidebar from './components/Dashboard/Sidebar'
import GsocSidebar from './components/Dashboard/GsocSidebar'
import NewEntryForm from './components/Dashboard/Forms/NormalContentNewEntryFrom'
import UpdateForm from './components/Dashboard/Forms/UpdateForm'
import DeleteForm from './components/Dashboard/Forms/DeleteForm'
import GsocInitTable from './components/Dashboard/Forms/GsocInitTable'
import GsocAddValue from './components/Dashboard/Forms/GsocAddValue'
import GsocUpdateValue from './components/Dashboard/Forms/GsocUpdateValue'
import GsocDeleteValue from './components/Dashboard/Forms/GsocDeleteValue'
import RecordsTable from './components/RecordsTable'
import { Record, DashboardOption, WriteOption, GsocDashboardOption, NewEntryForm as NewEntryFormType, UpdateForm as UpdateFormType, DeleteForm as DeleteFormType, GsocAddForm, GsocUpdateForm, GsocDeleteForm, TableStatus, NormalContentNewEntryForm } from './components/types'

// Mock data juz for now test the frontend output....
const mockRecords: Record[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    isCertificateIssued: "YES"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    isCertificateIssued: "NO"
  },
  {
    name: "Mike Johnson",
    email: "mike.j@example.com",
    isCertificateIssued: "YES"
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    isCertificateIssued: "NO"
  },
  {
    name: "David Brown",
    email: "david.b@example.com",
    isCertificateIssued: "YES"
  }
];

function App() {
  const [docLink, setDocLink] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [writeOption, setWriteOption] = useState<WriteOption>(null);
  const [dashboardOption, setDashboardOption] = useState<DashboardOption>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsocDashboardOption, setGsocDashboardOption] = useState<GsocDashboardOption>(null);
  const [tableStatus, setTableStatus] = useState<TableStatus>({
    isInitialized: false,
    message: 'Table not initialized'
  });
  const [gsocAddForm, setGsocAddForm] = useState<GsocAddForm>({
    username: '',
    email: '',
    isCertificateIssued: 'NO'
  });
  const [gsocUpdateForm, setGsocUpdateForm] = useState<GsocUpdateForm>({
    email: '',
    updateType: 'username',
    newValue: ''
  });
  const [gsocDeleteForm, setGsocDeleteForm] = useState<GsocDeleteForm>({
    email: ''
  });
  const [newEntry, setNewEntry] = useState<NormalContentNewEntryForm>({
    content: '',
    addPosition: 'end'
  });
  const [updateForm, setUpdateForm] = useState<UpdateFormType>({
    valueToUpdate: '',
    newValue: '',
    replaceAll: false
  });
  const [deleteForm, setDeleteForm] = useState<DeleteFormType>({
    contentToDelete: ''
  });

  const handleGetDetails = () => {
    setRecords(mockRecords);
  };

  const handleModifyDocs = () => {
    setShowModifyForm(true);
  };

  const handleWriteOptionSelect = (option: WriteOption) => {
    setWriteOption(option);
    setShowModifyForm(false);
  };

  const handleDashboardOptionSelect = (option: DashboardOption) => {
    setDashboardOption(option);
  };

  const handleNewEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords([...records, {
      name: newEntry.content,
        email: '',
        isCertificateIssued: 'NO'
      }]);
      setNewEntry({ content: '', addPosition: 'end' });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGsocDashboardOptionSelect = (option: GsocDashboardOption) => {
    setGsocDashboardOption(option);
  };

  const handleInitTable = () => {
    setTableStatus({
      isInitialized: true,
      message: 'Table successfully initialized'
    });
  };

  const handleGsocAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords([...records, {
      name: gsocAddForm.username,
      email: gsocAddForm.email,
      isCertificateIssued: gsocAddForm.isCertificateIssued
    }]);
    setGsocAddForm({ username: '', email: '', isCertificateIssued: 'NO' });
  };

  const handleGsocUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGsocDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <Header
        docLink={docLink}
        setDocLink={setDocLink}
        onGetDetails={handleGetDetails}
        onModifyDocs={handleModifyDocs}
        loading={loading}
      />

      {error && <div className="error">{error}</div>}

      {showModifyForm && (
        <WriteOptions onSelect={handleWriteOptionSelect} />
      )}

      {writeOption === 'normal' && (
        <div className="dashboard">
          <button 
            className="fetch-data-button"
            onClick={handleGetDetails}
            disabled={loading}
          >
            Fetch Data
          </button>
          <Sidebar
            onOptionSelect={handleDashboardOptionSelect}
            activeOption={dashboardOption}
          />
          
          <div className="content-area">
            {dashboardOption === 'newEntry' && (
              <NewEntryForm
                formData={newEntry}
                onChange={setNewEntry}
                onSubmit={handleNewEntrySubmit}
                loading={loading}
              />
            )}

            {dashboardOption === 'updateValue' && (
              <UpdateForm
                formData={updateForm}
                onChange={setUpdateForm}
                onSubmit={handleUpdateSubmit}
                loading={loading}
              />
            )}

            {dashboardOption === 'deleteValue' && (
              <DeleteForm
                formData={deleteForm}
                onChange={setDeleteForm}
                onSubmit={handleDeleteSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}

      {writeOption === 'gsoc' && (
        <div className="dashboard">
          <button 
            className="fetch-data-button"
            onClick={handleGetDetails}
            disabled={loading}
          >
            Fetch Data
          </button>
          <GsocSidebar
            onOptionSelect={handleGsocDashboardOptionSelect}
            activeOption={gsocDashboardOption}
          />
          
          <div className="content-area">
            {gsocDashboardOption === 'initTable' && (
              <GsocInitTable
                tableStatus={tableStatus}
                onInit={handleInitTable}
                loading={loading}
              />
            )}

            {gsocDashboardOption === 'addValue' && (
              <GsocAddValue
                formData={gsocAddForm}
                onChange={setGsocAddForm}
                onSubmit={handleGsocAddSubmit}
                loading={loading}
              />
            )}

            {gsocDashboardOption === 'updateValue' && (
              <GsocUpdateValue
                formData={gsocUpdateForm}
                onChange={setGsocUpdateForm}
                onSubmit={handleGsocUpdateSubmit}
                loading={loading}
              />
            )}

            {gsocDashboardOption === 'deleteValue' && (
              <GsocDeleteValue
                formData={gsocDeleteForm}
                onChange={setGsocDeleteForm}
                onSubmit={handleGsocDeleteSubmit}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}

      <RecordsTable records={records} />
    </div>
  )
}

export default App