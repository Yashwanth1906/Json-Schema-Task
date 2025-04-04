# Google Docs Manipulation (GSOC25 Task)
A full-stack application that allows you to manage content in Google Docs through a web interface. The application supports both table-based data management (GSOC-Tour Table Format) and normal content operations.

# Deployed URL
Link : https://json-schema-task-frontend.vercel.app/

## Features  

### Table Operations -> (Implemented the GSOC Project Format)

- Initialize table format in Google Docs (Which is currently in the format of [username, email, IsCertificateIssued])

- Add records to the table (Add to the end of the table)

- Update existing records (Updates the username or IsCertificateIssued status of a given email id)

- Delete records (Deletes the record of the given email id)

- View all records (The records in the table are displayed in the frontend)


### Normal Content Operations -> (Just to execute simple writing and reading from the doc outside of the TABLE)

- Add content at the beginning or end of the document (Simple texts or paragraphs outside of the Table)

- Update content with single or multiple occurrences (Replaces texts)

- Delete content with single or multiple occurrences (Deletes texts)

- View document content (Display the content of file)

## Tech Stack  

### Frontend

- React.js -> I chose React.js for this qualification task to easily manage the UI with a component-based architecture. It provides efficient state management, making it ideal for handling dynamic layout like one i built. Then my go to frontend tool is react.js.

- TypeScript -> I chose typescript over javascript because of the type safety in the frontend code, reducing runtime errors and improving code quality. All the content coming to the frontend will be structured at the response that im sending from backend.
*TradeOffs* : Code Complexity will be increased and types should be handled properly.

- Axios for API calls -> I chose Axios over Fetch API for handling HTTP requests because it provides better error handling, automatic request cancellation, and built-in support for req/resp transformations.

### Backend

- Express.js -> I chose express.js as the backend logic is simple and no complex needed to be implemented and also for the writing content into doc does not need any concurrent action to be performed so no need for concurrency supported languages like go. I chose javascript over typescript to handle the unstructured docs without any types .Writing types for those data can be a overhead for developers and maintainability will be comprimised there. 

- Google Docs API -> I chose Google Docs Api and google docs because of the free quota limit provided for it is 10x times higher for read request and 2x times higher for write request than Google Sheets API. And Google App Scripts takes lot of time to fetch data. Google Docs for Scalability and time taken to fetch data from it.
*TradeOffs* :  Code complexity as we can't insert a row into a table with a prefilled value so we need to manually write down code for maintaining the table structure.

Docs Quota Limit
![Image](https://github.com/user-attachments/assets/b4555b89-2439-47c1-bdf7-3bd78a7906e3)

Sheets Quota Limit
![Image](https://github.com/user-attachments/assets/5c6be03f-21b4-4304-99c9-c0b13493f745)

- Jest for testing -> Jest is the commonly used testing library for javascript and it is well suited for writing unit test for separate apis and it has inbuilt mocks that can be created for the docs object.


 ## Prerequisites

- Node.js (v14 or higher)

- npm or yarn

- Google Cloud Project with Google Docs API enabled

- Google Service Account credentials
- Docker (If you want to run the application using docker)

## Setting Up Google Service Account  

- Go to Google Cloud Platform and create a new project. https://console.cloud.google.com/

- Go to the project and select IAM and admin.

- Then in the sidebar you can find service accounts click on it.

- Then at the top click on the create service account.

- Give the name, desciption of the service account. And then click on create and continue.

- Then in the Grant access -> Select the role as owner or editor and click on DONE.

- Go inside the service account and then click on the keys and click on the Add Key and select json format.

- Copy the json file content and put in the GOOGLE_APPLICATION_CREDENTIALS environment variable.

- Demo Video to Setup API KEY:
https://github.com/user-attachments/assets/b93b7e7c-8abb-4e40-938e-0c3ebddbc0f4
  
## Environment Variables

Create the following environment files in the backend directory:

#### create .env file in the backend folder:

PORT = The port number where you want to run the backend server (Eg : 3000)

GOOGLE_APPLICATION_CREDENTIALS = Copy the key from the .json file downloaded and put that key surrounded by ``(backticks).

## Installation
**Method 1 : Without Using Docker (For Both Linux and windows)**
1. Clone the repository:
```bash
git clone https://github.com/Yashwanth1906/Json-Schema-Task.git
cd GSOC25-TaskJS
```
2. Install frontend dependencies:
```bash
cd  frontend
npm  install
npm run dev
```

3. Install backend dependencies:
```bash
cd  ../backend
npm  install
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**Method 2 : Using Docker**
1. Install Docker
- For Linux :
```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```
- For Windows:
	-   Download Docker Desktop from Docker's official website. https://www.docker.com/
	-   Install Docker and ensure it is running.
2. Run the Application
- Clone the Repo
```bash
git clone https://github.com/Yashwanth1906/Json-Schema-Task.git 
cd GSOC25-TaskJS
```
- Build the Docker images
```bash
docker-compose build
```
- Start the containers:
```bash
docker-compose up -d
```
- Stop the containers when done:
```bash
docker-compose down
```
After running the above commands, the application will be accessible at 
-   Frontend: [http://localhost:5173](http://localhost:5173)
-   Backend:  [http://localhost:3000](http://localhost:3000)

## Testing (Writing Tests for it....)

Run tests in the backend directory:
```bash
cd  backend
npm  test
```

## Demo Video:
https://github.com/user-attachments/assets/b947c2f4-4354-4684-8ebf-b43b9078db7c
