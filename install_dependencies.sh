# Install development dependencies
echo "Installing development dependencies..."
npm install --save-dev nodemon ndb

# Install general dependencies
echo "Installing general dependencies..."
npm install morgan express dotenv nodemailer express-rate-limit helmet express-mongo-sanitize hpp xss-clean

echo "Installation complete!"