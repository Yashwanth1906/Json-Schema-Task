import { docs } from "../docsSetup.js";

const DOCUMENT_ID = process.env.DOCID;

export const insertRow = async (req, res) => {
   const { username, email } = req.body;
   try {
      // Fetch the document content
      const response = await docs.documents.get({ documentId: DOCUMENT_ID });
      const content = response.data.body.content;

      let tableStartIndex = null;
      let firstTable = null;

      // Find the first table
      for (const element of content) {
         if (element.table) {
            console.log("Table found at index:", element.startIndex);
            tableStartIndex = element.startIndex;
            firstTable = element.table;
            break;
         }
      }

      if (tableStartIndex === null || !firstTable) {
         return res.json({ message: "Table not found", success: false });
      }

      // Insert a new row
      const insertRowRequest = [
         {
            insertTableRow: {
               tableCellLocation: {
                  tableStartLocation: { index: tableStartIndex }
               },
               insertBelow: true
            }
         }
      ];

      // Execute row insertion
      await docs.documents.batchUpdate({
         documentId: DOCUMENT_ID,
         requestBody: { requests: insertRowRequest }
      });

      // Fetch the updated document after inserting the row
      const updatedResponse = await docs.documents.get({ documentId: DOCUMENT_ID });
      const updatedContent = updatedResponse.data.body.content;

      let updatedTable = null;
      for (const element of updatedContent) {
         if (element.table) {
            updatedTable = element.table;
            break;
         }
      }

      if (!updatedTable) {
         return res.json({ message: "Table not found after update", success: false });
      }

      const lastTableStartIndex = tableStartIndex;

      let requests = [];
      const userDetails = [[username, email, "no"]];
      let index = lastTableStartIndex;
      userDetails.forEach(row => {
         index += 1; // Move to the next row
         row.forEach(cell => {
             index += 2; // Move to next cell
             requests.push({
                 insertText: {
                     location: { index },
                     text: cell
                 }
             });
         });
     });

     requests.reverse();

     await docs.documents.batchUpdate({
      documentId: DOCUMENT_ID,
      requestBody: { requests: requests }
      });

     return res.json({ message: "Table added successfully!", success: true });
   } catch (e) {
      console.error("Error:", e);
      return res.json({ message: e.message, success: false });
   }
};

export async function updateSecondRow(name, email, isCertificateIssued) {
   const doc = await docs.documents.get({ documentId: DOCUMENT_ID });
   const content = doc.data.body.content;

   let requests = [];
   let rowCount = 0;

   // Find tables in the document
   content.forEach((element) => {
       if (element.table) {
           element.table.tableRows.forEach((row, rowIndex) => {
               if (rowIndex === 1) { // Second row (Index 1)
                   console.log(`Updating row ${rowIndex}...`);
                   
                   // Update Name, Email, and isCertificateIssued columns (assuming 3 columns)
                   row.tableCells.forEach((cell, colIndex) => {
                       let newValue = "";
                       if (colIndex === 0) newValue = name; // Name Column
                       if (colIndex === 1) newValue = email; // Email Column
                       if (colIndex === 2) newValue = isCertificateIssued; // isCertificateIssued Column

                       if (newValue !== "") {
                           requests.push({
                               replaceAllText: {
                                   containsText: {
                                       text: cell.content[0]?.paragraph?.elements[0]?.textRun?.content.trim() || "",
                                       matchCase: true,
                                   },
                                   replaceText: newValue,
                               },
                           });
                       }
                   });

                   rowCount++;
               }
           });
       }
   });

   if (rowCount === 0) {
       console.log("Table or second row not found.");
       return { success: false, message: "Second row not found in any table." };
   }

   // Apply updates
   await docs.documents.batchUpdate({
       documentId: DOCUMENT_ID,
       requestBody: { requests },
   });

   console.log("Updated second row successfully.");
   return { success: true, message: "Second row updated successfully." };
}