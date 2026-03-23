const key = process.env.GEMINI_API_KEY;
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(r => r.json())
  .then(data => {
    const models = data.models || [];
    const imagenModels = models.filter(m => m.name.includes("imagen"));
    console.log("Imagen models:", imagenModels.map(m => m.name));
  })
  .catch(console.error);
