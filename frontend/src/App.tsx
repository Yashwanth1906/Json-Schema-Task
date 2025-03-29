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
import NormalContentDisplay from './components/NormalContentDisplay'
import { useDocumentHandlers } from './hooks/useDocumentHandlers'

const App = () => {
  const {
    docLink,
    records,
    paragraphContent,
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
  } = useDocumentHandlers();

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
      {paragraphContent.length>0 && (
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
                setTableStatus={setTableStatus}
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