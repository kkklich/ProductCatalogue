 # Product Catalog

A modern, full-stack web application built as a recruitment task to demonstrate clean architecture, scalable code organization, and modern UI/UX principles. 

This project consists of a **.NET C# REST API** on the backend and an **Angular** application on the frontend, featuring server-side pagination, sorting, filtering, and a responsive Material Design interface.

---

## 🚀 Features

* **Full CRUD Operations:** Create, Read, Update, and Delete products seamlessly.
* **Server-Side Processing:** Pagination, sorting, and search filtering are fully offloaded to the backend API for optimal performance.
* **Reactive Frontend:** Utilizes **RxJS** (`switchMap`, `debounceTime`) to handle search inputs efficiently and prevent unnecessary API calls.
* **Modern UI/UX:** Built with **Angular Material** (Data Tables, Dialogs, Paginator, Sort) and custom SCSS theming inspired by modern e-commerce branding.
* **Global Error Handling & Logging:** Centralized backend middleware tracks request execution times and gracefully handles unexpected exceptions.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** .NET 10 (C#) / ASP.NET Core Web API
* **Architecture:** N-Tier (Controllers, Services, Repositories)
* **Data Mapping:** AutoMapper
* **Data Storage:** In-Memory List (Simulating a real database)

### Frontend
* **Framework:** Angular (TypeScript)
* **UI Library:** Angular Material
* **Styling:** SCSS (Custom CSS Variables & Theming)
* **State Management / Async:** RxJS


## 🚀 How to Run Locally (Localhost)

This project is split into two separate environments. You will need to run the backend and the frontend simultaneously.

### Prerequisites
* **IDE:** Visual Studio 2026 (for C#) and VS Code (for Angular)
* **SDKs:** .NET 8 SDK (or newer) and Node.js (v18+)
* **CLI:** Angular CLI installed globally (`npm install -g @angular/cli`)

---

### Step 1: Start the Backend (C# .NET API)
1. Open **Visual Studio 2026**.
2. Select **Open a project or solution** and choose the `ProductCatalogApi.sln` file.
3. Once the project loads, press `Ctrl + F5` (Start Without Debugging) or click the green **"Run"** button at the top.
4. A console window or browser will open. The API will start listening on localhost.
5. **Important:** Note the exact port the API is running on (e.g., `https://localhost:7001` or `http://localhost:5000`). Leave this application running in the background.

---

### Step 2: Configure the Frontend connection
Before starting the Angular app, you must ensure it points to the correct backend port you just noted.
1. Open the `product-app-frontend` folder in **VS Code**.
2. run **npm i**
3. run **npm run start**


web url:  https://krzysztofklich.pl/products
  
azure url: https://nice-wave-09cbc3f0f.7.azurestaticapps.net