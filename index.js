import express from "express";
import { docs } from "./docsSetup.js";
import { insertRow, updateSecondRow } from "./controllers/handleWrite.js";


const app = express();
app.use(express.json());


const DOCUMENT_ID = process.env.DOCID;

async function updateCertificateStatus(email, newStatus) {
  try {
    const response = await docs.documents.get({ documentId: DOCUMENT_ID });
    const content = response.data.body.content;

    let emailStartIndex = null;
    let statusStartIndex = null;
    let statusEndIndex = null;

    // Find the email and status position
    content.forEach((element) => {
      if (element.paragraph && element.paragraph.elements) {
        const text = element.paragraph.elements
          .map(e => e.textRun?.content.trim())
          .join("");

        if (text.includes(email)) {
          emailStartIndex = element.startIndex;
          statusStartIndex = emailStartIndex + email.length + (71 - email.length); // Adjust position
          statusEndIndex = statusStartIndex + 3; // "YES" or "NO" is 3 characters long
        }
      }
    });

    if (!statusStartIndex || !statusEndIndex) {
      throw new Error("Email not found or could not determine status position.");
    }

    // Prepare update request
    const updateRequest = [
      {
        deleteText: {
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

    // Send update request
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests: updateRequest }
    });

    return { success: true, message: `Certificate status updated to ${newStatus}` };

  } catch (error) {
    console.error("Error updating certificate status:", error.message);
    return { success: false, error: error.message };
  }
}

// API Endpoint
app.post("/update-certificate-status", async (req, res) => {
  const {email, newStatus } = req.body;

  if (!email || !newStatus) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await updateCertificateStatus(email, newStatus);
  res.json(result);
});


async function addNewEntry(docId, name, email, status) {
  try {
    // Fetch document content
    const response = await docs.documents.get({ documentId: docId });
    const content = response.data.body.content;

    let lastIndex = null;

    // Find the last index (total length of document)
    content.forEach(element => {
      if (element.endIndex) {
        lastIndex = element.endIndex;
      }
    });

    if (!lastIndex) {
      throw new Error("Could not determine the last index in the document.");
    }

    // Format the new line with fixed widths
    const formattedName = name.padEnd(40, " ");  // 46 chars for name
    const formattedEmail = email.padEnd(60, " "); // 71 chars for email
    const formattedStatus = status; // YES or NO

    const newEntry = `\n${formattedName}${formattedEmail}${formattedStatus}`;

    // Insert new line at the last index
    const insertRequest = [
      {
        insertText: {
          location: { index: lastIndex - 1 }, // Insert before the last newline
          text: newEntry
        }
      }
    ];

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests: insertRequest }
    });

    console.log("New entry added successfully.");
    return { success: true, message: "Entry added." };

  } catch (error) {
    console.error("Error inserting entry:", error.message);
    return { success: false, error: error.message };
  }
}


app.post("/insert-entry", async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const result = await addNewEntry(DOCUMENT_ID, name, email, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export async function appendLines(req, res) {
  try {
      const docId = process.env.DOCID;

      // Fetch the document content
      const response = await docs.documents.get({ documentId: docId });
      const content = response.data.body.content;

      // Get the last available index
      let lastIndex = 1;
      content.forEach(el => {
          if (el.endIndex) lastIndex = el.endIndex;
      });

      console.log("Last index:", lastIndex);


      // Define text to be inserted
      const textToInsert = "New Line 1\nNew Line 2\n";

      // Prepare request to insert text
      const requests = [
          {
              insertText: {
                  location: { index: lastIndex - 1 }, // Append at last position
                  text: textToInsert
              }
          }
      ];

      // Execute batch update request
      await docs.documents.batchUpdate({
          documentId: docId,
          requestBody: { requests }
      });

      res.json({ success: true, message: "Lines appended successfully." });
  } catch (error) {
      console.error("Error appending lines:", error);
      res.status(500).json({ success: false, error: error.message });
  }
}
app.post("/append-lines", appendLines);

function extractTable(content) {
  let tableData = [];
  content.forEach(element => {
    if (element.table) {
      element.table.tableRows.forEach((row, rowIndex) => {
        let rowData = [];
        row.tableCells.forEach(cell => {
          console.log(cell.startIndex)
          let text = cell.content
            .map(p => p.paragraph?.elements?.map(e => e.textRun?.content).join("") || "")
            .join(" ");
          rowData.push(text.trim());
        });
        tableData.push(rowData);
      });
    }
  });
  return tableData;
}

app.get("/fetch-table", async (req, res) => {
  try {
    const response = await docs.documents.get({documentId : DOCUMENT_ID})
    const content = response.data.body.content;
    const tableData = extractTable(content);

    res.json({ tableData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function insertRowAtTopOfTable(docId, username, email) {
  try {
    // Get the document structure
    const doc = await docs.documents.get({ documentId: docId });

    let tableStartIndex = null;
    let firstTable = null;

    // Find the first table's start index
    for (const content of doc.data.body.content) {
      if (content.table) {
        tableStartIndex = content.startIndex;
        firstTable = content.table;
        break;
      }
    }

    if (tableStartIndex === null || !firstTable) {
      throw new Error('No table found in the document.');
    }

    // Step 1: Insert a row at the top
    const insertRowRequest = [
      {
        insertTableRow: {
          tableCellLocation : {
            tableStartLocation: {
              index: tableStartIndex,
            },
          },
          insertBelow: true, // Adds a new row at the top
        },
      },
    ];

    // Execute row insertion
    const insertResponse = await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests: insertRowRequest },
    });

    // Extract the start index of the new row (re-fetch the document to get updated structure)
    const updatedDoc = await docs.documents.get({ documentId: docId });

    let newRowCellIndexes = [];
    for (const content of updatedDoc.data.body.content) {
      if (content.table === firstTable) {
        for (const row of content.table.tableRows) {
          if (row.tableCells) {
            newRowCellIndexes = row.tableCells.map(cell => cell.startIndex);
            break; // We need only the first row
          }
        }
        break;
      }
    }

    if (newRowCellIndexes.length < 3) {
      throw new Error('Could not determine new row cell indexes.');
    }

    // Step 2: Insert text into the new row's first three cells
    const insertTextRequests = [
      {
        insertText: {
          location: { index: newRowCellIndexes[0] + 1 }, // First cell
          text: username,
        },
      },
      {
        insertText: {
          location: { index: newRowCellIndexes[1] + 1 }, // Second cell
          text: email,
        },
      },
      {
        insertText: {
          location: { index: newRowCellIndexes[2] + 1 }, // Third cell
          text: "No",
        },
      },
    ];

    // Execute text insertion
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests: insertTextRequests },
    });

    console.log('Row inserted and populated successfully.');
  } catch (error) {
    console.error('Error inserting row:', error.message);
  }
}

app.post('/insert-row',insertRow);
app.post('/update',async(req,res)=>{
  try{
    const {name,email} = req.body;
    const result = await updateSecondRow(name,email,"no");
    res.json(result);
  } catch(e) {
    console.log(e);
    res.json({success:false, error : e});
  }
})


app.post('/add-table', async (req, res) => {
    try {
        const documentId = process.env.DOCID;
        const { tableData } = req.body;

        if (!documentId || !tableData || !Array.isArray(tableData) || tableData.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide documentId and a valid tableData array." });
        }

        const response = await docs.documents.get({ documentId, fields: 'body' });
        const content = response.data.body.content;
        const tables = content.filter(c => c.table);
        console.log(tables.length)
        if (tables.length === 0) {
            const insertTableRequest = [{
              insertTable: {
                  rows: tableData.length,
                  columns: tableData[0].length,
                  endOfSegmentLocation: { segmentId: '' }
              }
          }];
          await docs.documents.batchUpdate({
              documentId,
              requestBody: { requests: insertTableRequest }
          });
            return res.status(500).json({ message: "Failed to insert table." });
        }


        const lastTableStartIndex = tables[tables.length - 1].startIndex;
        console.log(lastTableStartIndex);
        let requests = [];
        let index = lastTableStartIndex;

        tableData.forEach(row => {
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

        // Reverse requests to maintain correct order
        requests.reverse();

        // Insert text into the table cells
        await docs.documents.batchUpdate({
            documentId,
            requestBody: { requests }
        });

        return res.json({ message: "Table added successfully!", success: true });

    } catch (error) {
        console.error("Error adding table:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
});




const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
