import { docObject, DOCUMENT_ID} from "./docIDSetup.js";
import { docs } from "../docsSetup.js";

export const initTable = async(req,res)=>{
    try{
      const content = docObject.data.body.content;
      const records = [];
      return res.status(200).json({success: true, content});
    } catch(e) {
      console.log(e);
      return res.status(500).json({success: false, error: e.message});
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
      const content = docObject.data.body.content;
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
      console.log(parsedContent);
      return res.status(200).json({ success: true,  parsedContent });
    } catch (error) {
      console.error("Error fetching records:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
}


// export const insertEntry = async (req,res) => {
//     try {
//       const { name, email, status } = req.body;
//       const content = docObject.data.body.content;
  
//       let lastIndex = null;
  
//       content.forEach(element => {
//         if (element.endIndex) { 
//           lastIndex = element.endIndex;
//         }
//       });
  
//       if (!lastIndex) {
//         throw new Error("Could not determine the last index in the document.");
//       }
  
//       const formattedName = name.padEnd(20, " "); 
//       const formattedEmail = email.padEnd(60, " "); 
//       const formattedStatus = status;
//       if (formattedStatus === "NO") {
//         formattedStatus = "NO ";
//       }
//       const newEntry = `\n${formattedName}${formattedEmail}${formattedStatus}`;
  
//       const insertRequest = [
//         {
//           insertText: {
//             location: { index: lastIndex - 1 }, 
//             text: newEntry
//           }
//         }
//       ];
  
//       await docs.documents.batchUpdate({
//         documentId: docId,
//         requestBody: { requests: insertRequest }
//       });
  
//       console.log("New entry added successfully.");
//       res.json({ success: true, message: "Entry added." });
  
//     } catch (error) {
//       console.error("Error inserting entry:", error.message);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
  

// export const updateStatus = async (req,res) => {
//     try {
//       const { email, newStatus } = req.body;
//       if (!["YES", "NO"].includes(newStatus)) {
//         throw new Error("Invalid status. Must be either 'YES' or 'NO'");
//       }
//       if (newStatus == "NO") {
//         newStatus = "NO ";
//       }
//       const content = docObject.data.body.content;
  
//       let emailStartIndex = null;
//       let statusStartIndex = null;
//       let statusEndIndex = null;
//       content.forEach((element) => {
//         if (element.paragraph && element.paragraph.elements) {
//           const text = element.paragraph.elements
//             .map(e => e.textRun?.content.trim())
//             .join("");
  
//           if (text.includes(email)) {
//             emailStartIndex = element.startIndex;
//             const emailEndIndex = text.indexOf(email) + email.length;
//             const remainingText = text.slice(emailEndIndex);
//             const spacesToStatus = remainingText.indexOf("YES") !== -1 ? 
//               remainingText.indexOf("YES"): 
//               remainingText.indexOf("NO");
//             if (spacesToStatus === -1) {
//               throw new Error("Could not find status position after email");
//             }
            
//             statusStartIndex = emailStartIndex + emailEndIndex + spacesToStatus;
//             statusEndIndex = statusStartIndex + 3; 
//           }
//         }
//       });
  
//       if (!statusStartIndex || !statusEndIndex) {
//         throw new Error("Email not found or could not determine status position.");
//       }
  
//       const updateRequest = [
//         {
//           deleteContentRange: {
//             range: { startIndex: statusStartIndex, endIndex: statusEndIndex }
//           }
//         },
//         {
//           insertText: {
//             location: { index: statusStartIndex },
//             text: newStatus
//           }
//         }
//       ];
  
//       await docs.documents.batchUpdate({
//         documentId: DOCUMENT_ID,
//         requestBody: { requests: updateRequest }
//       });
  
//       res.json({ success: true, message: `Certificate status updated to ${newStatus}` });
  
//     } catch (error) {
//       console.error("Error updating certificate status:", error.message);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }



// export const writeContent = async (req,res) => {
//   try {
//     const { cont } = req.body;
    
//     const content = docObject.data.body.content;

//     let lastTableEndIndex = null;
//     let hasExistingContent = false;

//     for (let i = content.length - 1; i >= 0; i--) {
//       const element = content[i];
//       if (element.table) {
//         lastTableEndIndex = element.endIndex;
//         hasExistingContent = true;
//         break;
//       }
//     }

//     // If no table found, use document start
//     if (!lastTableEndIndex) {
//       lastTableEndIndex = 1;
//     }

//     // Format content with separator if there's existing content
//     const separator = "----------------------------------------\n";
//     const formattedContent = hasExistingContent ? 
//       `\n${separator}${cont}` : 
//       `${cont}`;
    
//     await docs.documents.batchUpdate({
//       documentId: DOCUMENT_ID,
//       requestBody: { 
//         requests: [{ 
//           insertText: { 
//             location: { index: lastTableEndIndex },   
//             text: formattedContent 
//           } 
//         }]
//       }
//     });
    
//     console.log("Content written successfully.");
//     return res.status(200).json({ 
//       success: true, 
//       message: "Content written successfully." 
//     });
//   }
//   catch(error) {
//     console.error("Error writing content:", error.message);
//     return res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// }
