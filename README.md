# AIdentify

AIdentify​‍​‌‍​‍‌​‍​‌‍​‍‌ is a full-stack application designed to detect AI-generated content across multiple media formats. With the help of Google's Gemini LLM, AIdentify can examine images, videos, and audio files to check if they are real or not. The tool then gives the user a confidence score along with a detailed explanation of the ​‍​‌‍​‍‌​‍​‌‍​‍‌classification.

---

## Features

- **Multi-Media​‍​‌‍​‍‌​‍​‌‍​‍‌ Analysis:** Identify AI-generated content in images, videos, and audio(.mp3, .wav) files.

- **Advanced AI Detection:** Implements Google's Gemini model for detailed examination of visual and acoustic artifacts.

- **User Authentication:** Easy sign-up and login secured by Clerk Authentication.

- **History & Management:** Keeps the details of the analyses in MongoDB, in this way, users can look through their previous results and organize their chat sessions.

- **Modern Dashboard:** An efficient user interface created with Next.js and Tailwind CSS, equipped with drag-and-drop file uploading.

- **Secure File Handling:** Files are handled securely. Cloudinary is used for temporary media ​‍​‌‍​‍‌​‍​‌‍​‍‌storage.

---

## Tech Stack

### Frontend

- **Framework:** Next.js

- **Language:** TypeScript

- **Styling:** Tailwind CSS, PostCSS

- **UI Components:** Radix UI, Material UI Icons, Lucide React

- **Authentication:** Clerk

### Backend

- **Framework:** FastAPI

- **Language:** Python

- **Database:** MongoDB (via Motor async driver)

- **AI Model:** Google Generative AI (Gemini)

- **Storage:** Cloudinary

- **Webhooks:** Svix (for Clerk user events)

---

## Usage

1. Open [AIdentify](https://aidentify-frontend.vercel.app/) in browser.

2. Sign in using your Clerk.

3. Use the drag-and-drop area to upload an Image, Video, or Audio(.mp3, .wav) file.

4. Check the result of the analysis.

5. Look at the history sidebar to see previous ​‍​‌‍​‍‌​‍​‌‍​‍‌analyses.

---

## Contributions

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request.

---

## License

This project is licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more information.

---
