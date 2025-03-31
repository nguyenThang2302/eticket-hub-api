# eTicket Hub API

## Overview

The **eTicket Hub API** is a backend service built with **NestJS** to manage ticketing operations. It includes features such as user authentication, profile management, and ticket handling. The application is designed to be modular, scalable, and easy to maintain.

## Features

- User authentication and authorization
- Profile management (update profile information, change password)
- Ticket management
- Database migrations and schema documentation
- Internationalization support

## Prerequisites

- Node.js (v16 or later)
- Docker and Docker Compose
- Make

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd eticket-hub-api
```

3. Install dependencies:

```bash
npm i
```

4. Start docker-compose for MainDB

```bash
make up
```

5. Setup environment variables (if applicable)

```bash
npm run start:dev
```