import {  DOCUMENT_ID } from "./docIDSetup.js";
import { docs } from "../docsSetup.js";

export const addEntry = async(req,res)=>{
  try{
    const {content, position} = req.body;
    
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    if (!doc.data.body?.content) {
      return res.status(404).json({
        success: false,
        error: 'No content found in document'
      });
    }

    let insertIndex = 1;
    
    if (position === "end") {
      const lastElement = doc.data.body.content[doc.data.body.content.length - 1];
      insertIndex = lastElement.endIndex || 1;
      insertIndex -= 1;
    }

    const formattedContent = position === "start" ? `${content}\n` : `\n${content}`;

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [{
          insertText: {
            text: formattedContent,
            location: { index: insertIndex }
          }
        }]
      }
    });

    return res.status(200).json({
      success: true,
      message: "Entry added successfully."
    });
  } catch(e) {
    console.error('Error adding entry:', e);
    return res.status(500).json({
      success: false,
      error: e.message || 'Failed to add entry'
    });
  }
}

export const updateEntry = async(req,res)=>{
  try{
    const {valueToUpdate, newValue, replaceAll} = req.body;
    console.log(replaceAll)
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    if (!doc.data.body?.content) {
      return res.status(404).json({
        success: false,
        error: 'No content found in document'
      });
    }
    
    let tableStartIndex = -1;
    let tableEndIndex = -1;

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

    let updateRequests = [];
    let indexAdjustment = 0;

    doc.data.body.content.forEach((element, index) => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (index >= tableStartIndex && index <= tableEndIndex) {
            return;
          }      
          if (el.textRun?.content.includes(valueToUpdate)) {
            const content = el.textRun.content;
            const wordStartIndex = content.indexOf(valueToUpdate);
            const startIndex = el.startIndex + wordStartIndex + indexAdjustment;
            const endIndex = startIndex + valueToUpdate.length;
            
            updateRequests.push({
              deleteContentRange: {
                range: {
                  startIndex,
                  endIndex
                }
              }
            });
            updateRequests.push({
              insertText: {
                text: newValue,
                location: {
                  index: startIndex
                }
              }
            });

            const lengthDifference = newValue.length - valueToUpdate.length;
            indexAdjustment += lengthDifference;

            if (!replaceAll) {
              return;
            }
          }
        });
      }
    });

    if (updateRequests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Text to update not found outside table region'
      });
    }
    
    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: updateRequests
      }
    });

    return res.status(200).json({
      success: true,
      message: "Entry updated successfully.",
      updateRequests
    });
  } catch(e) {
    console.error('Error updating entry:', e);
    return res.status(500).json({
      success: false,
      error: e.message || 'Failed to update entry'
    });
  }
}

export const deleteEntry = async(req,res)=>{
  try{
    const {contentToDelete,deleteAllOccurance} = req.body;
    
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    if (!doc.data.body?.content) {
      return res.status(404).json({
        success: false,
        error: 'No content found in document'
      });
    }

    let tableStartIndex = -1;
    let tableEndIndex = -1;

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

    let deleteRequests = [];
    let indexAdjustment = 0;

    doc.data.body.content.forEach((element, index) => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (index >= tableStartIndex && index <= tableEndIndex) {
            return;
          }   
          if (el.textRun?.content.includes(contentToDelete)) {
            const content = el.textRun.content;
            const wordStartIndex = content.indexOf(contentToDelete); 
            const startIndex = el.startIndex + wordStartIndex + indexAdjustment;
            const endIndex = startIndex + contentToDelete.length;
            deleteRequests.push({
              deleteContentRange: {
                range: {
                  startIndex,
                  endIndex
                }
              }
            });
            indexAdjustment -= contentToDelete.length;
            if (!deleteAllOccurance) {
              return;
            }
          }
        });
      }
    });

    if (deleteRequests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Text to delete not found outside table region'
      });
    }

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: deleteRequests
      }
    });

    return res.status(200).json({
      success: true,
      message: "Entry deleted successfully."
    });
  } catch(e) {
    console.error('Error deleting entry:', e);
    return res.status(500).json({
      success: false,
      error: e.message || 'Failed to delete entry'
    });
  }
} 
