application: customer-upload-fe-global

Description: Create a page to show all documents that are to be uploaded in current document group.

Prerequisite: app can be engaged with session-id and all the mandatory and optional parameters can be passed to the app using session-info. All mandatory params needs to be verifies before showing o any upload data, if mandatory params missing shown an appropriate error to user.

Requirements:

Documents to be shown as cards with an "upload" button(ref current Upload, Document list page for ui)
There can be 2 types of documents, mandatory and optional. 
Al the documents that have the "uploadSkippable" set to true will be treated as optional documents.
Optional documents can either be skipped entirely or can be uploaded later
All the mandatory documents would need to be uploaded to complete the upload process.
If a document is uploaded, in place of upload action button, card will show the "Uploaded" to notify that the given document is uploaded.
The page could be skipped through a parameter if there is only one document in the document group.
Action on this page:
Upload Later -> After all mandatory documents are uploaded, the optional documents can be skipped with this action. User is navigated to a Thankyou page showing relevant info, this page can be skipped with a parameter.
Back > based on a parameter, on desktop the "Back" button and on mobile the back button < from NavigationBar (component from common library)
Complete 

If multiple documents are present in the group this page cannot be skipped (even if the parameter to skip is present)

On click of upload, user is navigate to next page.

Service: To fetch the documents to be uploaded, we need to call get task with "Upload-documents" 

Confluence:

https://confluence.internal.unicredit.eu/display/AAHB4/Upload+Customer


