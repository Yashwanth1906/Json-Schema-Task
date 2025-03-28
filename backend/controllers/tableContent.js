import { DOCUMENT_ID} from "./docIDSetup.js";
import { docs } from "../docsSetup.js";

export const initTable = async(req,res)=>{
    try{
      const doc = await docs.documents.get({
        documentId: DOCUMENT_ID
      });
      let tableExists = false;
      doc.data.body.content.forEach(element => {
        if (element.paragraph?.elements) {
          element.paragraph.elements.forEach(el => {
            if (el.textRun?.content.includes('/* TABLE FORMAT START */')) {
              tableExists = true;
            }
          });
        }
      });
      if (tableExists) {
        return res.status(400).json({
          success: false, 
          error: 'Table format already exists'
        });
      }

      const tableFormat = `\n\n/* TABLE FORMAT START */\n\n` +
        `USERNAME${' '.repeat(25)}EMAIL${' '.repeat(61)}IsCertificateIssued\n\n\n` +
        `/* TABLE FORMAT END */\n`;

      let fullContent = '';
      let lastIndex = 1;
      
      doc.data.body.content.forEach(element => {
        if (element.paragraph?.elements) {
          element.paragraph.elements.forEach(el => {
            if (el.textRun?.content) {
              fullContent += el.textRun.content;
              lastIndex = el.endIndex || lastIndex;
            }
          });
        }
      });

      await docs.documents.batchUpdate({
        documentId: DOCUMENT_ID,
        requestBody: {
          requests: [{
            insertText: {
              text: tableFormat,
              location: { index: lastIndex - 1 }
            }
          }]
        }
      });
      
      return res.status(200).json({
        success: true, 
        message: 'Table format initialized successfully'
      });
    } catch(e) {
      console.error('Error initializing table:', e);
      return res.status(500).json({
        success: false, 
        error: e.message
      });
    }
}

export const addRecord = async(req,res)=>{
  try {
    const {username, email, isCertificateIssued} = req.body;
    
    const doc = await docs.documents.get({  
      documentId: DOCUMENT_ID   
    });

    let tableStartIndex = -1;
    let tableEndIndex = -1;
    let lastEntryIndex = -1;

    doc.data.body.content.forEach((element, index) => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun?.content.includes('/* TABLE FORMAT START */')) {
            tableStartIndex = index;
          } else if (el.textRun?.content.includes('/* TABLE FORMAT END */')) {
            tableEndIndex = index;
          }
        });
      }
    });

    if (tableStartIndex === -1 || tableEndIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Table format not found'
      });
    }

    for (let i = tableEndIndex - 1; i > tableStartIndex; i--) {
      const element = doc.data.body.content[i];
      if (element.paragraph?.elements) {
        const text = element.paragraph.elements
          .map(el => el.textRun?.content || '')
          .join('');    
        if (text.includes('USERNAME') || !text.trim()) {
          continue;
        }
        lastEntryIndex = element.endIndex;
        break;
      }
    }

    if (lastEntryIndex === -1) {
      lastEntryIndex = doc.data.body.content[tableStartIndex + 2].endIndex;
    }

    const newEntry = `${username.padEnd(35, " ")}${email.padEnd(69, " ")}${isCertificateIssued}\n`;

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [{
          insertText: {
            text: newEntry,
            location: { index: lastEntryIndex }
          }
        }]
      }
    });

    return res.status(200).json({
      success: true,
      message: "Record added successfully."
    });
  } catch (error) {
    console.error('Error adding record:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

export const updateRecord = async(req,res)=>{
  try {
    const {email, newValue, updateType} = req.body;
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    let tableStartIndex = -1;
    let tableEndIndex = -1;
    let targetLineIndex = -1;
    let targetLineStartIndex = -1;
    let targetLineEndIndex = -1;

    doc.data.body.content.forEach((element, index) => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun?.content.includes('/* TABLE FORMAT START */')) {
            tableStartIndex = index;
          } else if (el.textRun?.content.includes('/* TABLE FORMAT END */')) {
            tableEndIndex = index;
          }
        });
      }
    });

    if (tableStartIndex === -1 || tableEndIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Table format not found'
      });
    }

    for (let i = tableStartIndex + 1; i < tableEndIndex; i++) {
      const element = doc.data.body.content[i];
      if (element.paragraph?.elements) {
        const text = element.paragraph.elements
          .map(el => el.textRun?.content || '')
          .join('');
        
        if (text.includes('USERNAME') || !text.trim()) {
          continue;
        }

        const parts = text.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && parts[1] === email) {
          targetLineIndex = i;
          targetLineStartIndex = element.startIndex;
          targetLineEndIndex = element.endIndex;
          break;
        }
      }
    }

    if (targetLineIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Record with given email not found'
      });
    }

    const currentLine = doc.data.body.content[targetLineIndex].paragraph.elements
      .map(el => el.textRun?.content || '')
      .join('');
    const parts = currentLine.split(/\s+/).filter(Boolean);
    let newUsername = parts[0];
    let newEmail = parts[1];
    let newStatus = parts[2];
    if(updateType === 'username'){
      newUsername = newValue || parts[0]; 
      newEmail = email || parts[1];
      newStatus =  parts[2];
    }
    else if(updateType === 'certificate'){
      newUsername = parts[0];
      newEmail = email || parts[1];
      newStatus = newValue || parts[2];
    }

    const newLine = `${newUsername.padEnd(35, " ")}${newEmail.padEnd(69, " ")}${newStatus}\n`;

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            deleteContentRange: {
              range: {
                startIndex: targetLineStartIndex,
                endIndex: targetLineEndIndex
              }
            }
          },
          {
            insertText: {
              text: newLine,
              location: { index: targetLineStartIndex }
            }
          }
        ]
      }
    });

    return res.status(200).json({
      success: true,
      message: "Record updated successfully."
    });

  } catch (error) {
    console.error('Error updating record:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

export const deleteRecord = async(req,res)=>{
  try {
    const {email} = req.body;

    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    let tableStartIndex = -1;
    let tableEndIndex = -1;
    let startIndex = -1;
    let endIndex = -1;

    doc.data.body.content.forEach((element, index) => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun?.content.includes('/* TABLE FORMAT START */')) {
            tableStartIndex = index;
          } else if (el.textRun?.content.includes('/* TABLE FORMAT END */')) {
            tableEndIndex = index;
          }
        });
      }
    });

    if (tableStartIndex === -1 || tableEndIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Table format not found'
      });
    }

    for (let i = tableStartIndex + 1; i < tableEndIndex; i++) {
      const element = doc.data.body.content[i];
      if (element.paragraph?.elements) {
        const text = element.paragraph.elements
          .map(el => el.textRun?.content || '')
          .join('');
        if (text.includes('USERNAME') || !text.trim()) {
          continue;
        }
        const parts = text.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && parts[1] === email) {
            startIndex = element.startIndex;
            endIndex = element.endIndex;
            break;
        }
      }
    }

    if (startIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Record with given email not found'
      });
    }

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            deleteContentRange: {
              range: {
                startIndex: startIndex,
                endIndex: endIndex
              }
            }
          }
        ]
      }
    });

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully."
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
} 

const parseDocContent = (content)=> {
    const tableStartMarker = '/* TABLE FORMAT START */';
    const tableEndMarker = '/* TABLE FORMAT END */';  
    const tableStartIndex = content.indexOf(tableStartMarker);
    const tableEndIndex = content.indexOf(tableEndMarker);
  
    if (tableStartIndex === -1 || tableEndIndex === -1) {
      return {
        gsocRecords: [],
        normalContent: [content]
      };
    }
    
    const tableContent = content.slice(
      tableStartIndex + tableStartMarker.length,
      tableEndIndex
    ).trim();
  
    const beforeTable = content.slice(0, tableStartIndex).trim();
    const afterTable = content.slice(tableEndIndex + tableEndMarker.length).trim();
    const normalContent = [beforeTable, afterTable].filter(Boolean);
    const lines = tableContent.split('\n').filter(line => line.trim());
    const gsocRecords = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const [username, email, isCertificateIssued] = line
        .split(/\s+/)
        .filter(Boolean);
        if (username && email && isCertificateIssued) {
          gsocRecords.push({
            username,
            email,
            isCertificateIssued
          });
        }
      }
    }
  
    return {
      gsocRecords,
      normalContent
    };
};


export const getAllRecords = async (req,res) => {  
    try {
      const doc = await docs.documents.get({
        documentId: DOCUMENT_ID
      });

      const content = doc.data.body.content;
      let fullContent = '';
      
      content.forEach(item => {
        if (item.paragraph?.elements) {
          item.paragraph.elements.forEach(element => {
            if (element.textRun?.content) {
              fullContent += element.textRun.content;
            }
          });
        }
      });
      
      const parsedContent = parseDocContent(fullContent);
      return res.status(200).json({ 
        success: true,  parsedContent
      });
    } catch (error) {
      console.error("Error fetching records:", error.message);
      return res.status(500).json({
        success: false, error: error.message 
      });
    }
}