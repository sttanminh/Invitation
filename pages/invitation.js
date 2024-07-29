import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Invitation() {
  const router = useRouter();
  const { eventId, inviteeId } = router.query;
  const [event, setEvent] = useState(null);
  const [invitee, setInvitee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    if (eventId && inviteeId) {
      async function fetchEventAndInvitee() {
        try {
          const res = await fetch(`/api/${eventId}`);
          if (!res.ok) throw new Error('Failed to fetch event details');
          const data = await res.json();
          setEvent(data);

          const inviteeData = data.invitees.find(inv => inv.name === inviteeId);
          if (!inviteeData) throw new Error('Invitee not found');
          setInvitee(inviteeData);
          setAttributes(inviteeData.attributes || {});
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchEventAndInvitee();
    }
  }, [eventId, inviteeId]);

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/${eventId}/${inviteeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attributes }),
      });

      if (!res.ok) throw new Error('Failed to submit attributes');
      alert('Attributes updated successfully!');
    } catch (err) {
      alert('Failed to submit attributes');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event || !invitee) return <p>No invitee found</p>;

  return (
    <div className="container">
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <h2>Welcome, {invitee.name}</h2>
      <p>Please fill out your details below:</p>
      <div>
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleAttributeChange}
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
