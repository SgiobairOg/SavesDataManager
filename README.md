# SARSAT Saves Data Manager
Angular application for parsing narrative accounts from the SARSAT Program's Saves Reports to extract incident details. These details will eventually be used to populate GIS tables and statistical reports for the program. [Preview here](https://rawgit.com/SgiobairOg/SavesDataManager/master/index.html).

>*The NOAA SARSAT program, part of the international Cospas-Sarsat program, uses earth-orbiting satellites to identify and locate emergency radio beacons operating on the 406MHz frequency. This free program has accounted for more than 7500 rescues in the United States and over 40,000 worldwide. For more information visit [https://www.sarsat.noaa.gov](https://www.sarsat.noaa.gov).*

## Project Status
### Current Status
- Established methods and helpers for parsing input text into save object values.

### To-Do
- [ ] Design and code layout and templates
- [ ] Develop service to handle CRUD operations on .csv data file.
- [ ] Add controllers to handle addition and editing of new save records.
- [ ] Split app.js into component files
- [ ] Clean up code.
- [ ] Add service for compiling save statistics

### Prospective
- [ ] Add multi-record upload from CSV
- [ ] Add multi-record parsing from Word Doc
