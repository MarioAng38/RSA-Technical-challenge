# RSA-Technical-challenge

RSA Technical Challenge - Readme

---

Descriere Generala

Aceasta aplicatie web este o solutie pentru Problem 1: Visualizing Team Activity and Estimation Accuracy in a Project Management System. Aplicatia preia datele dintr-un API JSON (similara unui sistem Jira), proceseaza si vizualizeaza informatii esentiale despre activitatea si performanta echipei de dezvoltare software.

---

Ce face aplicatia?

- Se conecteaza la API-ul public furnizat, care returneaza date despre task-uri (sprinturi, taskuri, estimari, timp real lucrat, status etc.).
- Proceseaza datele pentru a extrage insight-uri relevante, cum ar fi:

  - Capacitatea fiecarui dezvoltator (cate task-uri sunt atribuite si cate finalizate).
  - Precizia estimarilor (comparatie intre ore estimate si ore reale lucrate).
  - Eficienta si progresul general al echipei.

- Prezinta aceste date folosind biblioteca Highcharts prin grafice vizuale atractive (column chart, pie chart, line chart).
- Include un dashboard cu indicatori KPI (total taskuri, eficienta medie, procent estimari vs realizat).
- Implementare robusta cu validarea datelor si tratarea erorilor.
- Adauga animatii de incarcare (loading spinners) si mesaje de eroare in cazul in care datele nu pot fi preluate.

---

Limitari tehnice

Din cauza politicilor CORS ale browserelor, aplicatia nu poate fi deschisa direct prin dublu click pe fisierul index.html, deoarece foloseste fetch pentru a prelua datele dintr-un API extern. Browserul blocheaza astfel de cereri din surse locale (file://).

---

Cum rulez aplicatia local?

Trebuie sa porniti un server local pentru a putea incarca corect datele.

Daca aveti Python3 instalat, rulati in terminal, din folderul proiectului:

python3 -m http.server 8000

Apoi accesati in browser:

[http://localhost:8000](http://localhost:8000)

Alternativ, daca folositi Visual Studio Code, puteti deschide proiectul si porni extensia Live Server, care va gazdui aplicatia local si va permite vizualizarea fara probleme de CORS.

---

Schema bazei de date pentru platforma de gestionare evenimente

Aceasta parte reprezinta solutia pentru Problem 2: Database Schema Design – Event Management Platform.

---

Ce am implementat?

- O baza de date relationala care acopera functionalitatile unei platforme pentru gestionarea evenimentelor.
- Tabele principale:

  - Users: stocheaza utilizatorii, inclusiv roluri (utilizator obisnuit, organizator), informatii personale si date de autentificare.
  - Events: informatii despre evenimente (titlu, descriere, perioada, locatie), legate de utilizatorul care a creat evenimentul.
  - Organizers: tabel intermediar pentru asocierea utilizatorilor cu evenimentele pe care le organizeaza.
  - Sessions: sub-evenimente ale unui eveniment, cu detalii si speakeri.
  - Registrations: inregistrarile utilizatorilor la sesiuni.
  - Feedback: feedback-ul utilizatorilor pentru sesiuni (rating, comentarii).

---

Aspecte importante de design

- Chei primare si straine definite corect pentru a mentine integritatea datelor.
- Normalizare pentru evitarea redundantei si a inconsistentei.
- Restrictii de integritate, cum ar fi:

  - Un utilizator poate lasa feedback doar daca este inregistrat la sesiunea respectiva (implementat prin trigger SQL).

- Schema este scalabila si permite extinderi viitoare, cum ar fi urmarirea prezentei, gestionarea organizatorilor multipli, etc.

---

Rezumat

- Problem 1 a fost rezolvata printr-o aplicatie web care preia, valideaza si vizualizeaza date de management de proiect folosind Highcharts.
- Problem 2 a fost rezolvata prin proiectarea unui model de baze de date relational pentru o platforma de evenimente, cu atentie la integritate si extensibilitate.
