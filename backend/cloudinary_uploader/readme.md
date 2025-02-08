
# 📂 Cloudinary File Upload Script

This script uploads files to **Cloudinary** and returns the **URL** of the uploaded file.

----------

## 📌 Features

-   Uploads **any file type** (auto-detects format).
-   Stores files in the **"myfiles"** folder on [Cloudinary](https://cloudinary.com/).
-   Returns a **URL** for the uploaded file.

----------

## 🛠️ Setup

### **1. Install Dependencies**

Make sure you have Python installed, then install the required library:

```bash
pip install cloudinary

```

### **2. Configure Environment Variables**

Create a `.env` file in the same directory and add your Cloudinary credentials:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Replace `API_KEY`, `API_SECRET`, and `CLOUD_NAME` with your actual Cloudinary credentials.

----------

## 🚀 Usage

### **Upload a File**

Use the `cloudinary_upload_file`  function to upload files.

### **Example:**

```python
audio_url = cloudinary_upload_file("path/to/file.jpg")
print("File URL:", audio_url)
```
