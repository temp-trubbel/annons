# Annons

### Hur man startar igång annonsen:
1. Först måste [VS Code](https://code.visualstudio.com/) vara installerat tillsammas med [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) tillägget.

2. Öppna sedan hela mappen i VS Code och klicka på Live Server knappen `Go Live` längst ner till höger i VS Code fönstret.

3. Servern är nu live och serverar Annons frontend på server:port origin http://127.0.0.1:5500

4. Du kan också dubbelchecka vilken port som används (skall vara 5500) längst ner till höger i VS Code fönstret.

5. Detta är också server:port origin http://127.0.0.1:5500 som används för `AD_FRONTEND_ORIGIN` i `.env` filen i `backend` mappen.

6. `index.html` är en mockup tidningssajt enbart för demonstration. Den innehåller både en iFrame med vår annons samt ett script `script.js` för att skicka över språket på tidningssajten och som kör lite kod för att hantera modal/popup av iFrame:en.