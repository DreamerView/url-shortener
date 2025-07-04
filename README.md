# URL Shortener Microservice

A simple full-stack JavaScript application that provides a URL shortening service, similar to the FreeCodeCamp URL Shortener Microservice project. This service lets you submit a long URL and returns a shortened identifier. When accessed, the shortened URL redirects to the original URL.

## Features

* **Shorten URLs:** Generate a short identifier for any valid URL.
* **Redirect:** Access `/api/shorturl/:id` to be redirected to the original URL.
* **Validation:** Uses `dns.lookup()` to verify that the submitted URL's domain exists.
* **Persistence:** Stores URL mappings in a SQLite database (`database.sqlite`).

## Prerequisites

* [Node.js](https://nodejs.org/) (v12 or later)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* Optional: [SQLite3 CLI](https://www.sqlite.org/) for manual database inspection

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/url-shortener-sqlite.git
   cd url-shortener-sqlite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm start
   ```

   The server will start on port `3000` by default. You can change the port by setting the `PORT` environment variable.

## Usage

### Shorten a URL

* **Endpoint:** `POST /api/shorturl`
* **Body (application/x-www-form-urlencoded):**

  * `url` — the original URL to shorten (must include protocol, e.g. `https://`)

**Example request (cURL):**

```bash
curl -X POST -d "url=https://example.com" http://localhost:3000/api/shorturl
```

**Successful response:**

```json
{
  "original_url": "https://example.com",
  "short_url": 1
}
```

If the URL is invalid or the domain does not resolve, the response is:

```json
{ "error": "invalid url" }
```

### Redirect to Original URL

* **Endpoint:** `GET /api/shorturl/:id`

  * `:id` is the numeric identifier returned by the POST request.

**Example:**

```
GET /api/shorturl/1
```

The server responds with an HTTP 302 redirect to the original URL.

If no matching record is found, the response is:

```json
{ "error": "No short URL found for the given input" }
```

## Project Structure

```
url-shortener-sqlite/
├── database.sqlite      # SQLite database file (auto-created)
├── models/              # (optional) for ORM-style separation
├── public/              # (optional) static assets or index.html
├── script.js            # main server application (Express + SQLite)
├── package.json
└── README.md
```

## Development Tips

* The SQLite database file (`database.sqlite`) is created automatically on first run.
* To inspect or clear the database, use the SQLite CLI:

  ```bash
  sqlite3 database.sqlite
  sqlite> .tables
  sqlite> DELETE FROM urls;
  sqlite> .exit
  ```
* If you deploy to a platform like Replit or Railway, ensure that the working directory is writable and persists between restarts.

## License

This project is licensed under the MIT License
