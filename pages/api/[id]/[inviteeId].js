import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';


export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('InvitationApp');
  const { id, inviteeId } = req.query;
  console.log(id +" hello  "+ inviteeId)
  if (req.method === 'GET') {
    try {
      const event = await db.collection('Event').findOne({ _id: new ObjectId(id) });
      console.log(" Finding event")
      if (!event) return res.status(404).json({ message: 'Event not found' });
      // Assuming inviteeId is a string identifier (name, email, etc.)
      const invitee = event.invitees.find(inv => inv.name === inviteeId);
      if (!invitee) return res.status(404).json({ message: 'Invitee not found' });

      res.status(200).json(invitee);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching invitee details', error });
    }
  } 
   if (req.method === 'POST') {
    try {
      console.log("trying to POST")
      const { attributes } = req.body;
      // Find the invitee and update the attributes using name as the identifier
      const result = await db.collection('Event').updateOne(
        { _id: new ObjectId(id), 'invitees.name': inviteeId },
        { $set: { 'invitees.$.attributes': attributes } }
      );

      if (result.modifiedCount === 0) {
        console.log("Can not find invitee")
        return res.status(404).json({ message: 'Event or invitee not found' });
      }

      res.status(200).json({ message: 'Invitee attributes updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating invitee attributes', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}