# ValimarCars Web App

This is a simple web app for managing car service records:  
- Add vehicle services with registration number, VIN, kilometers, mechanic, services, notes, and upload a form/image  
- The files are stored in localStorage (base64), and records too  
- File names are auto-generated as `yyyy-mm-dd-REGINDEX-originalName`  
- Search by registration number or VIN  
- Records sorted by date (newest first)

## How to Deploy

1. Create a new GitHub repository, push these files.  
2. Go to Netlify → “New site” → connect GitHub → choose this repo → Deploy.  
3. Or upload manually via drag & drop in Netlify’s “Deploy manually”.

## Limitations & Notes

- localStorage has size limits (≈5–10 MB); for more data or many files, use cloud storage (Firebase, S3, etc.).  
- For production, move file storage to real backend or serverless storage.  

## Future Enhancements

- Use Firebase / backend to store files and data  
- Add authentication (user accounts)  
- Use OCR on uploaded images to parse fields  
- Add pagination, filtering, file preview  
