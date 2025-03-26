import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import WriteOptions from './components/WriteOptions'
import Sidebar from './components/Dashboard/Sidebar'
import GsocSidebar from './components/Dashboard/GsocSidebar'
import NewEntryForm from './components/Dashboard/Forms/NewEntryFrom'
import UpdateForm from './components/Dashboard/Forms/UpdateForm'
import DeleteForm from './components/Dashboard/Forms/DeleteForm'
import GsocInitTable from './components/Dashboard/Forms/GsocInitTable'
import GsocAddValue from './components/Dashboard/Forms/GsocAddValue'
import GsocUpdateValue from './components/Dashboard/Forms/GsocUpdateValue'
import GsocDeleteValue from './components/Dashboard/Forms/GsocDeleteValue'
import RecordsTable from './components/RecordsTable'
import {  DashboardOption, WriteOption, GsocDashboardOption, NewEntryForm as NewEntryFormType, UpdateForm as UpdateFormType, DeleteForm as DeleteFormType, GsocAddForm, GsocUpdateForm, GsocDeleteForm, TableStatus, GsocRecord, NormalContent } from './components/types'
import axios from 'axios'
import { BACKEND_URL } from './config'
import NormalContentDisplay from './components/NormalContentDisplay'

// Mock data juz for now test the frontend output....
const mockRecords: GsocRecord[] = [
  {
    username: "John Doe",
    email: "john.doe@example.com",
    isCertificateIssued: "YES"
  },
  {
    username: "Jane Smith",
    email: "jane.smith@example.com",
    isCertificateIssued: "NO"
  },
  {
    username: "Mike Johnson",
    email: "mike.j@example.com",
    isCertificateIssued: "YES"
  },
  {
    username: "Sarah Williams",
    email: "sarah.w@example.com",
    isCertificateIssued: "NO"
  },
  {
    username: "David Brown",
    email: "david.b@example.com",
    isCertificateIssued: "YES"
  }
];

function App() {
  const [docLink, setDocLink] = useState('');
  const [records, setRecords] = useState<GsocRecord[]>([]);
  const [paragraphContent, setParagraphContent] = useState<string[]>([]);
  const [normalContent, setNormalContent] = useState<string>('');
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [docsLinkUpdated, setDocsLinkUpdated] = useState(false);
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
  const [newEntry, setNewEntry] = useState<NewEntryFormType>({
    content: '',
    position: 'end'
  });
  const [updateForm, setUpdateForm] = useState<UpdateFormType>({
    valueToUpdate: '',
    newValue: '',
    replaceAll: false
  });
  const [deleteForm, setDeleteForm] = useState<DeleteFormType>({
    contentToDelete: ''
  });

  const handleGetDetails = async() => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/table/get-all-records`);
      console.log(response.data.parsedContent);
      if (response.data.success) {
          setParagraphContent(response.data.parsedContent.normalContent);
          setRecords(response.data.parsedContent.gsocRecords);
      }
    } catch (err) {
      console.log(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleModifyDocs = () => {
    setShowModifyForm(true);
  };

  const handleWriteOptionSelect = (option: WriteOption) => {
    setWriteOption(option);
    setShowModifyForm(false);
    setRecords([]);
    setNormalContent('');
  };

  const handleDashboardOptionSelect = (option: DashboardOption) => {
    setDashboardOption(option);
  };

  const handleNewEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNormalContent(prev => {
      if (newEntry.position === 'start') {
        return newEntry.content + '\n' + prev;
      }
      return prev + '\n' + newEntry.content;
    });
    setNewEntry({ content: '', position: 'end' });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateForm.replaceAll) {
      setNormalContent(normalContent.split(updateForm.valueToUpdate).join(updateForm.newValue));
    } else {
      setNormalContent(normalContent.replace(updateForm.valueToUpdate, updateForm.newValue));
    }
    setUpdateForm({ valueToUpdate: '', newValue: '', replaceAll: false });
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNormalContent(normalContent.replace(deleteForm.contentToDelete, ''));
    setDeleteForm({ contentToDelete: '' });
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
      username: gsocAddForm.username,
      email: gsocAddForm.email,
      isCertificateIssued: gsocAddForm.isCertificateIssued
    }]);
    setGsocAddForm({ username: '', email: '', isCertificateIssued: 'NO' });
  };

  const handleGsocUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(records.map(record => {
      if (record.email === gsocUpdateForm.email) {
        if (gsocUpdateForm.updateType === 'username') {
          return { ...record, username: gsocUpdateForm.newValue };
        } else {
          return { ...record, isCertificateIssued: gsocUpdateForm.newValue };
        }
      }
      return record;
    }));
    setGsocUpdateForm({ email: '', updateType: 'username', newValue: '' });
  };

  const handleGsocDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(records.filter(record => record.email !== gsocDeleteForm.email));
    setGsocDeleteForm({ email: '' });
  };

  const setDocsLink = async() => {
    await axios.post(`${BACKEND_URL}/api/doc/set-docId`, { docLink })
    .then((res)=>{
      if(res.data.success){
        setDocsLinkUpdated(true);
        alert(res.data.message);
      }
      else{
        alert(res.data.error);
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return (
    <div className="container">
      <Header
        docLink={docLink}
        setDocLink={setDocLink}
        onGetDetails={handleGetDetails}
        onModifyDocs={handleModifyDocs}
        loading={loading}
        docsLinkUpdated={docsLinkUpdated}
        setDocsLink={setDocsLink}
      />
      {error && <div className="error">{error}</div>}

      {showModifyForm && (
        <WriteOptions onSelect={handleWriteOptionSelect} />
      )}
      {paragraphContent && (
        <NormalContentDisplay content={paragraphContent}/>
      )}
      {records && (
        <RecordsTable records={records} />
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
    </div>
  )
}

export default App