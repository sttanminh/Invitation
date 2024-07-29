import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteeName, setInviteeName] = useState('');
  const [newDefaultAttribute, setNewDefaultAttribute] = useState('');

  useEffect(() => {
    if (id) {
      async function fetchEvent() {
        try {
          const res = await fetch(`/api/${id}`);
          if (!res.ok) throw new Error('Failed to fetch event');
          const data = await res.json();
          setEvent(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchEvent();
    }
  }, [id]);

  const handleAddInvitee = async () => {
    if (!inviteeName) return; // Prevent adding invitee without a name

    try {
      const res = await fetch(`/api/${id}/invitees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteeName }),
      });

      if (!res.ok) throw new Error('Failed to add invitee');
      const data = await res.json();
      // Update the event state to reflect the newly added invitee
      setEvent(prev => ({
        ...prev,
        invitees: [...(prev.invitees || []), { name: inviteeName, attributes: { ...prev.defaultAttributes } }]
      }));
      setInviteeName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDefaultAttribute = async () => {
    if (!newDefaultAttribute) return; // Prevent adding empty attribute

    try {
      const res = await fetch(`/api/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defaultAttributeName: newDefaultAttribute }),
      });

      if (!res.ok) throw new Error('Failed to add default attribute');
      const data = await res.json();
      setEvent(prev => ({
        ...prev,
        defaultAttributes: { ...prev.defaultAttributes, [newDefaultAttribute]: 0 }
      }));
      setNewDefaultAttribute('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>No event found</p>;

  return (
    <div className="container">
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      
      <h2>Default Attributes</h2>
      <ul>
        {event.defaultAttributes && Object.entries(event.defaultAttributes).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newDefaultAttribute}
        onChange={(e) => setNewDefaultAttribute(e.target.value)}
        placeholder="New Default Attribute"
      />
      <button onClick={handleAddDefaultAttribute}>Add Default Attribute</button>
      
      <h2>Invitees</h2>
      <table className="invitees-table">
        <thead>
          <tr>
            <th>Name</th>
            {event.defaultAttributes && Object.keys(event.defaultAttributes).map(attr => (
              <th key={attr}>{attr}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(event.invitees || []).map((invitee, index) => (
            <tr key={index}>
              <td>
                <Link href={{ pathname: '/invitation', query: { eventId: event._id, inviteeId: invitee.name } }}>
                  {invitee.name}
                </Link>
              </td>
              {Object.keys(event.defaultAttributes).map(attr => (
                <td key={attr}>{invitee.attributes[attr] || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Invitee</h2>
      <input
        type="text"
        value={inviteeName}
        onChange={(e) => setInviteeName(e.target.value)}
        placeholder="Invitee Name"
      />
      <button onClick={handleAddInvitee}>Add Invitee</button>
    </div>
  );
}
