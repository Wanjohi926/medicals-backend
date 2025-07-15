import express from 'express';

import UserRoutes from './users/users.router';
import doctor from './doctors/doctors.router';
import appointment from './Appointments/Appointments.router';
import complaint from './Complaints/complaints.router';
import payment from './Payments/payments.router';
import prescriptions from './Prescriptions/prescriptions.router'

const app = express();
app.use(express.json());

UserRoutes(app);
doctor(app);
appointment(app);
complaint(app);
payment(app);
prescriptions(app);

app.get('/', (req, res) => {
    res.send('Hello, World');
})

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
})

export default app;
