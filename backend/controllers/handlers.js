import { docs } from "../docsSetup.js";

const DOCUMENT_ID = process.env.DOCID;
export const insertEntry = async (req,res) => {
    try {
      const { name, email, status } = req.body;
      const response = await docs.documents.get({ documentId: DOCUMENT_ID });
      const content = response.data.body.content;
  
      let lastIndex = null;
  
      content.forEach(element => {
        if (element.endIndex) {
          lastIndex = element.endIndex;
        }
      });
  
      if (!lastIndex) {
        throw new Error("Could not determine the last index in the document.");
      }
  
      const formattedName = name.padEnd(20, " "); 
      const formattedEmail = email.padEnd(60, " "); 
      const formattedStatus = status;
      if (formattedStatus === "NO") {
        formattedStatus = "NO ";
      }
      const newEntry = `\n${formattedName}${formattedEmail}${formattedStatus}`;
  
      const insertRequest = [
        {
          insertText: {
            location: { index: lastIndex - 1 }, 
            text: newEntry
          }
        }
      ];
  
      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: { requests: insertRequest }
      });
  
      console.log("New entry added successfully.");
      res.json({ success: true, message: "Entry added." });
  
    } catch (error) {
      console.error("Error inserting entry:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  

export const updateStatus = async (req,res) => {
    try {
      const { email, newStatus } = req.body;
      if (!["YES", "NO"].includes(newStatus)) {
        throw new Error("Invalid status. Must be either 'YES' or 'NO'");
      }
      if (newStatus == "NO") {
        newStatus = "NO ";
      }
      const response = await docs.documents.get({ documentId: DOCUMENT_ID });
      const content = response.data.body.content;
  
      let emailStartIndex = null;
      let statusStartIndex = null;
      let statusEndIndex = null;
      content.forEach((element) => {
        if (element.paragraph && element.paragraph.elements) {
          const text = element.paragraph.elements
            .map(e => e.textRun?.content.trim())
            .join("");
  
          if (text.includes(email)) {
            emailStartIndex = element.startIndex;
            const emailEndIndex = text.indexOf(email) + email.length;
            const remainingText = text.slice(emailEndIndex);
            const spacesToStatus = remainingText.indexOf("YES") !== -1 ? 
              remainingText.indexOf("YES"): 
              remainingText.indexOf("NO");
            if (spacesToStatus === -1) {
              throw new Error("Could not find status position after email");
            }
            
            statusStartIndex = emailStartIndex + emailEndIndex + spacesToStatus;
            statusEndIndex = statusStartIndex + 3; 
          }
        }
      });
  
      if (!statusStartIndex || !statusEndIndex) {
        throw new Error("Email not found or could not determine status position.");
      }
  
      const updateRequest = [
        {
          deleteContentRange: {
            range: { startIndex: statusStartIndex, endIndex: statusEndIndex }
          }
        },
        {
          insertText: {
            location: { index: statusStartIndex },
            text: newStatus
          }
        }
      ];
  
      await docs.documents.batchUpdate({
        documentId: DOCUMENT_ID,
        requestBody: { requests: updateRequest }
      });
  
      res.json({ success: true, message: `Certificate status updated to ${newStatus}` });
  
    } catch (error) {
      console.error("Error updating certificate status:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }

export const getAllRecords = async (req,res) => {  
  try {
    const response = await docs.documents.get({ documentId: DOCUMENT_ID });
    const content = response.data.body.content;
    const records = [];

    content.forEach((element) => {
      if (element.paragraph && element.paragraph.elements) {
        const text = element.paragraph.elements
          .map(e => e.textRun?.content)
          .join("");
        if (text.trim() && !text.includes("Name") && !text.includes("Email")) {
          const name = text.substring(0, 20).trim();
          const email = text.substring(20, 80).trim();
          const status = text.substring(80).trim();
          
          records.push([name, email, status]);
        }
      }
    });
    return res.status(200).json({ success: true, records });
  } catch (error) {
    console.error("Error fetching records:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export const writeContent = async (req,res) => {
  try {
    const { cont } = req.body;
    const response = await docs.documents.get({ documentId: DOCUMENT_ID });
    const content = response.data.body.content;
    
    let lastIndex = null;
    content.forEach(element => {
      if (element.endIndex) {
        lastIndex = element.endIndex;
      }
    });

    if (!lastIndex) {
      throw new Error("Could not determine the last index in the document.");
    }

    const formattedContent = `\n${cont}`;
    
    await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: { 
        requests: [{ 
          insertText: { 
            location: { index: lastIndex - 1 },   
            text: formattedContent 
          } 
        }]
      }
    });
    
    console.log("Content written successfully.");
    return res.status(200).json({ success: true, message: "Content written successfully." });
  }
  catch(error) {
    console.error("Error writing content:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}