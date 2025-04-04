import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { 
  DashboardOption, 
  WriteOption, 
  GsocDashboardOption, 
  NewEntryForm as NewEntryFormType,
  UpdateForm as UpdateFormType,
  DeleteForm as DeleteFormType, 
  GsocAddForm, 
  GsocUpdateForm, 
  GsocDeleteForm, 
  GsocRecord 
} from '../components/types';

export const useDocumentHandlers = () => {
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
  const [tableStatus, setTableStatus] = useState<boolean>(false);
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
    contentToDelete: '',
    deleteAllOccurance : false
  });

  const handleGetDetails = async() => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/table/get-all-records`);
      if (response.data.success) {
        setParagraphContent(response.data.parsedContent.normalContent);
        setRecords(response.data.parsedContent.gsocRecords);
        alert(response.data.message || 'Records fetched successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleModifyDocs = () => {
    setWriteOption(null)
    setShowModifyForm(true);
    setRecords([]);
    setNormalContent('');
    setParagraphContent([]);
  };

  const handleWriteOptionSelect = (option: WriteOption) => {
    setWriteOption(option);
    setShowModifyForm(false);
    setRecords([]);
    setNormalContent('');
    setParagraphContent([]);
  };

  const handleDashboardOptionSelect = (option: DashboardOption) => {
    setDashboardOption(option);
    setRecords([]);
    setNormalContent('');
    setParagraphContent([]);
  };

  const handleNewEntrySubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/normal/add-entry`, {
        content: newEntry.content,
        position: newEntry.position
      });
      if (response.data.success) {
        setNormalContent(response.data.normalContent);
        setNewEntry({ content: '', position: 'end' });
        alert(response.data.message || 'Entry added successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to add entry' + err);
      alert('Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/normal/update-entry`, {
        valueToUpdate: updateForm.valueToUpdate,
        newValue: updateForm.newValue,
        replaceAll: updateForm.replaceAll
      });
      
      if (response.data.success) {
        if (updateForm.replaceAll) {
          setNormalContent(normalContent.split(updateForm.valueToUpdate).join(updateForm.newValue));
        } else {
          setNormalContent(normalContent.replace(updateForm.valueToUpdate, updateForm.newValue));
        }
        setUpdateForm({ valueToUpdate: '', newValue: '', replaceAll: false });
        alert(response.data.message || 'Entry updated successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to update record' + err);
      alert('Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/normal/delete-entry`, {
        contentToDelete: deleteForm.contentToDelete,
        deleteAllOccurance: deleteForm.deleteAllOccurance
      });
      
      if (response.data.success) {
        setNormalContent(normalContent.replace(deleteForm.contentToDelete, ''));
        setDeleteForm({ contentToDelete: '', deleteAllOccurance: false });
        alert(response.data.message || 'Entry deleted successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to delete record' + err);
      alert('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const handleGsocDashboardOptionSelect = (option: GsocDashboardOption) => {
    setGsocDashboardOption(option);
    setRecords([]);
    setNormalContent('');
    setParagraphContent([]);
  };

  const handleInitTable = async() => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/table/init-table`);
      if (response.data.success) {
        setTableStatus(false);
        alert(response.data.message || 'Table initialized successfully');
      } else {
        setTableStatus(false);
        alert(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setTableStatus(false);
      alert('Failed to initialize table');
    } finally {
      setLoading(false);
    }
  };

  const handleGsocAddSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/table/add-record`, {
        username: gsocAddForm.username,
        email: gsocAddForm.email,
        isCertificateIssued: gsocAddForm.isCertificateIssued
      });
      
      if (response.data.success) {
        setRecords([...records, {
          username: gsocAddForm.username,
          email: gsocAddForm.email,
          isCertificateIssued: gsocAddForm.isCertificateIssued
        }]);
        setGsocAddForm({ username: '', email: '', isCertificateIssued: 'NO' });
        alert(response.data.message || 'Record added successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to add record' + err);
      alert('Failed to add record');
    } finally {
      setLoading(false);
    }
  };

  const handleGsocUpdateSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/table/update-record`, {
        email: gsocUpdateForm.email,
        updateType: gsocUpdateForm.updateType,
        newValue: gsocUpdateForm.newValue
      });
      
      if (response.data.success) {
        if (gsocUpdateForm.updateType === 'username') {
          setRecords(records.map(record => 
            record.email === gsocUpdateForm.email 
              ? { ...record, username: gsocUpdateForm.newValue }
              : record
          ));
        } else {
          setRecords(records.map(record => 
            record.email === gsocUpdateForm.email 
              ? { ...record, isCertificateIssued: gsocUpdateForm.newValue }
              : record
          ));
        }
        setGsocUpdateForm({ email: '', updateType: 'username', newValue: '' });
        alert(response.data.message || 'Record updated successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to update record' + err);
      alert('Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleGsocDeleteSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/table/delete-record`, {
        email: gsocDeleteForm.email
      });
      
      if (response.data.success) {
        setRecords(records.filter(record => record.email !== gsocDeleteForm.email));
        setGsocDeleteForm({ email: '' });
        alert(response.data.message || 'Record deleted successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      setError('Failed to delete record' + err);
      alert('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const setDocsLink = async() => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/doc/set-docId`, {
        docLink
      });
      if (response.data.success) {
        setDocsLinkUpdated(true);
        alert(response.data.message || 'Document link updated successfully');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update document link');
      alert('Failed to update document link');
    } finally {
      setLoading(false);
    }
  };

  return {
    docLink,
    records,
    paragraphContent,
    normalContent,
    showModifyForm,
    docsLinkUpdated,
    writeOption,
    dashboardOption,
    loading,
    error,
    gsocDashboardOption,
    tableStatus,
    gsocAddForm,
    gsocUpdateForm,
    gsocDeleteForm,
    newEntry,
    updateForm,
    deleteForm,
    setTableStatus,
    setDocLink,
    setGsocAddForm,
    setGsocUpdateForm,
    setGsocDeleteForm,
    setNewEntry,
    setUpdateForm,
    setDeleteForm, 
    handleGetDetails,
    handleModifyDocs,
    handleWriteOptionSelect,
    handleDashboardOptionSelect,
    handleNewEntrySubmit,
    handleUpdateSubmit,
    handleDeleteSubmit,
    handleGsocDashboardOptionSelect,
    handleInitTable,
    handleGsocAddSubmit,
    handleGsocUpdateSubmit,
    handleGsocDeleteSubmit,
    setDocsLink
  };
}; 