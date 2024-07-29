// pages/api/events.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise.connect();
      const db = client.db('InvitationApp'); // Replace with your actual DB name
      const events = await db.collection('Event').find({}).toArray();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  } else if (req.method === 'POST') {
    try {
      const client = await clientPromise.connect();
      const db = client.db('InvitationApp');
      const newEvent = req.body;
      const result = await db.collection('Event').insertOne(newEvent);
      res.status(201).json(result.ops[0]); // Respond with the created event
    } catch (error) {
      res.status(500).json({ message: 'Error adding event', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}