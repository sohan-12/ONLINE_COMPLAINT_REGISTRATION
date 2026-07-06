# Model-View-Controller (MVC) Pattern

This document explains the Model-View-Controller (MVC) architectural pattern implemented in the backend application of the **Online Complaint Registration** system.

The complaint backend application follows the Model-View-Controller (MVC) architectural pattern, a software design approach that separates an application into three interconnected layers. This separation allows for modularity, easier maintenance, and scalability.

---

## 1. Architectural Layers

### 🗃️ Model Layer (Data Layer)
The Model layer is responsible for handling all data-related logic. This includes the definition of data schemas and the operations performed on the database using those schemas. The models are implemented using **Mongoose**, which provides a schema-based solution to model application data for MongoDB.

* **Components**: Located in `backend/models/` (e.g., `User.js`, `Complaint.js`, `Assignment.js`, `Message.js`).

---

### ⚙️ Controller Layer
The Controller layer acts as an intermediary between the view (routes) and the model. It receives incoming requests, processes the input (which may include validation or transformation), calls the appropriate methods from the model, and then returns a response to the client.

* **Components**: Located in `backend/controllers/` (e.g., `authController.js`, `complaintController.js`).

---

### 💻 View Layer (Routing Layer)
In the context of a backend REST API, the View is implemented as the **routing layer**, where various endpoints are defined. These endpoints determine how the backend responds to different HTTP requests (GET, POST, PUT, DELETE) and are responsible for invoking the appropriate controller functions.

* **Components**: Located in `backend/routes/` (e.g., `authRoutes.js`, `complaintRoutes.js`).

---

## 2. Advantages of Using MVC in This Project

* **Separation of Concerns**: Each layer has a clearly defined responsibility, improving readability and maintainability.
* **Scalability**: New features can be added easily by creating new routes, controllers, and models.
* **Reusability**: Logic in controllers and models can be reused across multiple parts of the application.
* **Testing**: Each layer can be tested independently, especially the controllers and models.
* **Collaboration-Friendly**: Multiple developers can work simultaneously on different layers without conflict.

