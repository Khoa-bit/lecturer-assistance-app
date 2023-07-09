erDiagram
    entity "users" {
        string created
        string email
        bool emailVisibility
        string id PK
        string lastResetSentAt
        string lastVerificationSentAt
        string passwordHash
        string tokenKey
        string updated
        string username
        bool verified
        string person
        bool justRegistered
    }

    entity "attachments" {
        string created
        string document
        string file
        string id PK
        string updated
    }

    entity "classes" {
        string classId
        string cohort
        string created
        string major
        string fullDocument
        string id PK
        string academicProgram
        string updated
    }

    entity "courseTemplates" {
        string courseId
        string created
        string id PK
        string name
        int periodsCount
        string updated
        string academicProgram
    }

    entity "courses" {
        string courseTemplate
        string created
        string fullDocument
        string id PK
        string semester
        string updated
    }

    entity "departments" {
        string created
        string id PK
        string name
        string updated
        string departmentId
    }

    entity "documents" {
        string created
        string id PK
        string name
        string priority
        string status
        string thumbnail
        string updated
        string diffHash
        string owner
        string deleted
string     string(DEFAULT '')
        string attachmentsHash
        string startTime
        string endTime
        string description
    }

    entity "eventDocuments" {
        string created
        string fullDocument
        string id PK
        string updated
        string recurring
        string toFullDocument
        string reminderAt
    }

    entity "fullDocuments" {
        string created
        string document
        string id PK
        string updated
        string internal
    }

    entity "majors" {
        string created
        string id PK
        string name
        string updated
        string department
        string majorId
    }

    entity "participants" {
        string created
        string document
        string id PK
        string note
        string permission
        string person
        string role
        string updated
        string status
    }

    entity "people" {
        string avatar
        string created
        string deleted
        string major
        string gender
        string id PK
        string name
        string personId
        string personalEmail
        string phone
        string placeOfBirth
        string title
        string updated
        string thumbnail
        string interests
        string contactRoom
        string contactLocation
        string experience
        string education
        bool isFaculty
        bool hasAccount
        string dayOfBirth
    }

    entity "relationships" {
        string created
        string fromPerson
        string id PK
        string toPerson
        string updated
    }

    entity "personalNotes" {
        string created
        string fullDocument
        string id PK
        string updated
    }

    entity "academicMaterials" {
        string category
        string created
        string fullDocument
        string id PK
        string updated
    }

    entity "services" {
        string created
        string email
        bool emailVisibility
        string id PK
        string lastResetSentAt
        string lastVerificationSentAt
        string passwordHash
        string tokenKey
        string updated
        string username
        bool verified
    }

    users ||--o people
    attachments ||--o documents
    classes ||--o majors
    classes ||--o fullDocuments
    courseTemplates ||--|> courses
    courses ||--o courseTemplates
    courses ||--o fullDocuments
    documents ||--o people
    fullDocuments ||--o documents
    relationships ||--o people
    relationships ||--o people
    personalNotes ||--o fullDocuments
    academicMaterials ||--o fullDocuments
    eventDocuments ||--o fullDocuments
    eventDocuments ||--o fullDocuments
    users ||--o people
    departments ||--o majors
    people ||--o majors
    majors ||--o departments
    participants ||--o documents
    participants ||--o people
