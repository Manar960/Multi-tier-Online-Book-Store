# Multi-tier-Online-Book-Store
The store will employ a two-tier web design - a front-end and a backend - and use microservices at each tier. The front-end tier will accept user requests and perform initial processing. The backend consists of two components: a catalog server and an order server. 
#Architecture
1-Catalog Server: It contains database containing information about the available books. This information includes details such as the book title, quantity in stock, price, and the topic of the book.
functions as a microservice dedicated to managing and providing information about the available books. Implemented as an independent process, it offers a RESTful API supporting operations such as querying books by subject or item number and updating book details.

2-Order Server: Responsible for managing customer orders. Implemented as a microservice, the order server communicates with catalog server and front-end server, to facilitate the purchase process.This microservice is designed to handle the purchase operation efficiently and provides a single operation endpoint, typically through a RESTful API. 

3-Frontend Server: Initial point of contact for user requests and orchestrates interactions between the user interface and the backend services. Implemented as a microservice, the front-end server supports a variety of user operations through a RESTful API. 


