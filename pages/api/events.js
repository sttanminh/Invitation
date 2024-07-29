// pages/api/events.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    console.log("noooooo")
  if (req.method === 'GET') {
    console.log("sth")
    try {
      const client = await clientPromise.connect();
      console.log(client)
      const db = client.db('InvitationApp'); // Replace with your actual DB name
      console.log("nameOK")
      const events = await db.collection('Event').find({}).toArray();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
