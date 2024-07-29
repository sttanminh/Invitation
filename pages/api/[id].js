import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise.connect();
  const db = client.db('InvitationApp');
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }

      const event = await db.collection('Event').findOne({ _id: new ObjectId(id) });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event', error });
    }
  } else if (req.method === 'POST') {
    const { inviteeName } = req.body;

    if (!inviteeName) {
      return res.status(400).json({ message: 'Invitee name is required' });
    }

    try {
      const event = await db.collection('Event').findOne({ _id: new ObjectId(id) });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Initialize invitee attributes with default attributes set to 0
      const inviteeAttributes = {};
      for (const key in event.defaultAttributes) {
        inviteeAttributes[key] = 0;
      }

      const newInvitee = {
        name: inviteeName,
        attributes: inviteeAttributes
      };

      const result = await db.collection('Event').updateOne(
        { _id: new ObjectId(id) },
        { $push: { invitees: newInvitee } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json({ message: 'Invitee added' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  } else if (req.method === 'PATCH') {
    const { defaultAttributeName } = req.body;

    if (!defaultAttributeName) {
      return res.status(400).json({ message: 'Default attribute name is required' });
    }

    try {
      const event = await db.collection('Event').findOne({ _id: new ObjectId(id) });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Add new default attribute
      const updatedAttributes = {
        ...event.defaultAttributes,
        [defaultAttributeName]: 0
      };

      await db.collection('Event').updateOne(
        { _id: new ObjectId(id) },
        { $set: { defaultAttributes: updatedAttributes } }
      );

      res.status(200).json({ message: 'Default attribute added' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating default attributes', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
