# README

## Setup server

### 1) install dependencies

```(shell)
    cd server
    npm install
```

### 2) setup database and prisma

- Make sure you install and starts posgresql in you computer:

```(shell)
    brew install postgresql
    brew services start postgresql
```

- Setup prisma:

```(shell)
    npx prisma generate
    npx prisma migrate dev --name create_initial_tables
```

## API Docs

