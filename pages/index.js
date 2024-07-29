import React, { useState, useEffect } from 'react';
import Modal from './Modals'; // Adjust this path as necessary
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      if (!res.ok) throw new Error('Failed to add event');
      const addedEvent = await res.json();
      setEvents(prev => [...prev, addedEvent]);
      setNewEvent({ name: '', description: '', date: '' }); // Reset form
      setIsModalOpen(false); // Close modal
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <Link href={`/${event._id}`}>
              
                <h2>{event.name}</h2>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setIsModalOpen(true)}>Add New Event</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={newEvent.name}
            onChange={handleChange}
            placeholder="Event Name"
            required
          />
          <textarea
            name="description"
            value={newEvent.description}
            onChange={handleChange}
            placeholder="Event Description"
            required
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Event</button>
        </form>
      </Modal>
    </div>
  );
}
