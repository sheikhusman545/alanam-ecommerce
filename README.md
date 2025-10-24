# alanam-ecommerce
---

## 🚀 Al Anaam – eCommerce Mobile Application

**Al Anaam** is a hybrid mobile eCommerce application built using **Ionic 7** and **Angular** on the frontend, with a **PHP-based backend server**. Designed for performance and flexibility, it allows users to browse, search, and purchase products through a clean and intuitive interface.

---

### 🛠️ Tech Stack

* **Frontend**: Ionic 7 + Angular
* **Backend**: PHP (RESTful API)
* **Platform**: Android / iOS (Hybrid)
* **Package Manager**: npm / Ionic CLI

---

### 📦 Installation

Before starting the app, ensure you have the following installed:

* [Node.js](https://nodejs.org/)
* [Ionic CLI](https://ionicframework.com/docs/cli)
* [Angular CLI](https://angular.io/cli)
* [PHP](https://www.php.net/) (for backend)
* A mobile emulator or device (for testing)

---

### ▶️ Start Command (Frontend - Ionic/Angular)

To run the app in development mode (frontend):

```bash
ionic serve
```

This will start a local development server and open the app in your default browser.

For Android or iOS testing:

```bash
ionic cap run android
# or
ionic cap run ios
```

Make sure to build the app first before running on a device:

```bash
ionic build
ionic cap sync
```

---

### 🌐 Backend (PHP API Server)

The backend is built with PHP and should be hosted on a local or remote server. To run locally, you can use:

```bash
php -S localhost:8000 -t public/
```

> Replace `public/` with your backend's public root directory if different.

Ensure your Ionic app is pointing to the correct API URL in your environment file or service configuration.

---

### 📁 Folder Structure (Overview)

```
al-anaam/
├── src/                # Angular/Ionic source code
├── www/                # Built web assets
├── backend/            # PHP API code (optional folder name)
└── capacitor.config.ts # Capacitor configuration
```

---

### 📄 Notes

* Ensure CORS is properly configured in the PHP backend.
* You can integrate with any MySQL-compatible database.
* For production builds, use:

  ```bash
  ionic build --prod
  ```

---

#https://shopapi.alanaam.qa/api/app-version/latest