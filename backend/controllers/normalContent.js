import { docObject, DOCUMENT_ID } from "./docIDSetup.js";
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
    
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    if (!doc.data.body?.content) {
      return res.status(404).json({
        success: false,
        error: 'No content found in document'
      });
    }

    let startIndex = -1;
    let endIndex = -1;

    doc.data.body.content.forEach(element => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun?.content.includes(valueToUpdate)) {
            startIndex = el.startIndex;
            endIndex = startIndex + valueToUpdate.length;
          }
        });
      }
    });

    if (startIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Text to update not found'
      });
    }

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [{
          replaceText: {
            text: newValue,
            startIndex,
            endIndex
          }
        }]
      }
    });

    return res.status(200).json({
      success: true,
      message: "Entry updated successfully."
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
    const {contentToDelete} = req.body;
    
    const doc = await docs.documents.get({
      documentId: DOCUMENT_ID
    });

    if (!doc.data.body?.content) {
      return res.status(404).json({
        success: false,
        error: 'No content found in document'
      });
    }

    let startIndex = -1;
    let endIndex = -1;

    doc.data.body.content.forEach(element => {
      if (element.paragraph?.elements) {
        element.paragraph.elements.forEach(el => {
          if (el.textRun?.content.includes(contentToDelete)) {
            startIndex = el.startIndex;
            endIndex = startIndex + contentToDelete.length;
          }
        });
      }
    });

    if (startIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Text to delete not found'
      });
    }

    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: {
        requests: [{
          deleteContentRange: {
            range: {
              startIndex,
              endIndex
            }
          }
        }]
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
