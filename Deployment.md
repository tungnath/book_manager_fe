## Deployment - Flask Backend and Vanilla Web Frontend

Below are the **free platforms** and **step-by-step instructions** to deploy your Flask backend and static frontend

### 1. Deploying Your Flask Backend

**Platform:** [Railway](https://railway.app/) (30 days trial only)

Railway offers a generous free tier for deploying Python web apps, including Flask. It integrates easily with GitHub and provides a public URL for your backend.

#### **Steps:**

1. **Prepare Your Flask App**
    - Ensure your app is structured with an `app.py` (or similar) as the entry point.
    - Create a `requirements.txt` file:

```bash
pip freeze > requirements.txt
```

    - Add `gunicorn` to `requirements.txt` (needed for production):

```
gunicorn==20.1.0
```

    - Create a `Procfile` (no extension) with this line:

```
web: gunicorn app:app
```

*(Replace `app:app` with the correct module and app name if different.)*
#### **Note: Above steps are done already in the latest code** 


2. **Push to GitHub**
    - Update your backend app's github repo with the latest code, if not already done.
   
3. **Deploy on Railway**
    - Sign up at [Railway](https://railway.app/) (30 days trial only).
    - Click **“Start New Project”** and choose **“Deploy from GitHub repo”**.
    - Select your Flask app repository.
    - Railway will auto-detect your Python app and install dependencies.
    - Once deployed, you’ll get a public URL (e.g., `https://your-app.up.railway.app`).
    - You can add a custom domain if desired.

**Your Flask backend is now live and ready to serve API requests.

### 2. Deploying Your Static Frontend

**Free Platform:** Cloudflare Pages

This allows you to deploy static HTML/CSS/JS sites.


#### **Cloudflare Pages (For Custom Domain \& Git Integration)**

1. **Push Your Frontend to GitHub**
    - Create a new repo for your frontend code and push your files.
2. **Deploy on Cloudflare Pages**
    - Sign up at [Cloudflare](https://pages.cloudflare.com/) (no credit card needed).
    - Click **“Create a Project”** and connect your GitHub repo.
    - Select the repo and deploy (no build command needed for static sites).
    - Get a public URL (e.g., `https://your-site.pages.dev`).
    - Optionally, set up a custom domain.

### 3. Test Connections Frontend and Backend

- In your frontend JavaScript, set your API URLs to the Railway backend URL.
- Example:

```js
fetch('https://your-app.up.railway.app/api/endpoint')
```



