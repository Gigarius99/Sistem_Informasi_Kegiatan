const bcrypt = require('bcryptjs');
const hash = '$2b$10$xKyO1FRrJA1td/7s9QPqueAWnpDSE.PH9N7xsiwFeX1q.EMPW5hQW';
bcrypt.compare('admin123', hash).then(console.log).catch(console.error);