import { docs } from "../docsSetup.js";

let DOCUMENT_ID = "";
let docObject;

export const setDocId = async(req,res)=>{
  try{
    const {docLink} = req.body;
    console.log(docLink);
    if(!docLink){
      throw new Error("Document Link is required.");
    }
    if(docLink.includes("https://docs.google.com/document/d/")){
        DOCUMENT_ID = docLink.split("/d/")[1].split("/edit")[0];  
    }
    else{
      return res.status(400).json({success: false, error: "Invalid document Link."});
    }
    docObject = await docs.documents.get({ documentId: DOCUMENT_ID });
    return res.status(200).json({success: true, message: "Document ID set successfully."});
  } catch(e) {
    console.log(e);
    return res.status(500).json({success: false, error: e.message});
  }
}
export {docObject,DOCUMENT_ID};
