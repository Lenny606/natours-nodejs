# Natours Web - NodeJS Project
- built with NodeJS, practice project 

## Prerequisites
- Node.js (recommended version)
- npm (Node Package Manager)

## Project Dependencies

### Core Dependencies
- **Express**: Web application framework
- **Nodemon**: Development server with auto-restart
- **Morgan**: HTTP request logger middleware
- **Dotenv**: Environment variable management
- **Nodemailer**: Email sending capabilities
- **Express-rate-limit**: Protect against brute-force attacks
- **Helmet**: Enhance API security
- **xss-clean**: xss protection
- **hpp**: http parameter pollution protection
- **express-mongo-sanitize**: string escaping
- **pug**: template engine
- **cookie-parser**: cookies
- **axios**
- **cors**
- **compression** compress data in request
- **parcel-bundler**: JS bundler (dev)
- **@babel/polyfill**: support for older browsers
- **multer**: image upload
- **sharp**: image resize
- **stripe**: payments
- **npm i html-to-text**: stringify html for emails

## Installation

### Dependency Installation
To install all project dependencies, use one of the following methods:

#### Option 1: Manual Installation
```bash
npm i express nodemon morgan dotenv nodemailer express-rate-limit helmet express-mongo-sanitize xss-clean hpp pug --save-dev
```

#### Option 2: Automated Script
```bash
./install_dependencies.sh
```

## Database Management

### Purge Collections
Remove all existing data from collections:
```bash
node utils/import-dev-data.js --purge
```

### Import Collections
Populate database with initial data:
```bash
node utils/import-dev-data.js --import
```

## Development

### Run Development Server
Start the application with Node debugger:
```bash
npm run debug
```

## Additional Resources
- [Morgan Middleware Documentation](https://expressjs.com/en/resources/middleware/morgan.html)

## Best Practices
- Always use environment variables for sensitive configurations
- Implement rate limiting to prevent abuse
- Utilize Helmet for enhanced security headers

## Troubleshooting
- Ensure all dependencies are correctly installed
- Check environment variable configurations
- Verify database connection settings

## Services
- SendGrid - production emails
- Mailsac - email testing
- Stripe payments