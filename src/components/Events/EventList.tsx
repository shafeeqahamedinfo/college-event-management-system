import React, { useState, useEffect } from 'react';
import { Event, Registration } from '../../types';
import { EventCard } from './EventCard';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter } from 'lucide-react';

export function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const categories = [
    'All',
    'Academic',
    'Cultural',
    'Sports',
    'Technical',
    'Workshop',
    'Seminar',
    'Competition',
    'Social',
    'Other'
  ];

  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  const loadEvents = () => {
    const savedEvents: Event[] = JSON.parse(localStorage.getItem('events') || '[]');
    const approvedEvents = savedEvents.filter(event => event.status === 'approved');
    setEvents(approvedEvents);
  };

  const loadRegistrations = () => {
    const savedRegistrations: Registration[] = JSON.parse(localStorage.getItem('registrations') || '[]');
    setRegistrations(savedRegistrations);
  };

  const handleRegister = (eventId: string) => {
    if (!user) return;

    const existingRegistration = registrations.find(
      reg => reg.eventId === eventId && reg.userId === user.id
    );

    if (existingRegistration) {
      setRegistrationMessage('You are already registered for this event!');
      setTimeout(() => setRegistrationMessage(''), 3000);
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const eventRegistrations = registrations.filter(reg => reg.eventId === eventId);
    if (event.maxParticipants && eventRegistrations.length >= event.maxParticipants) {
      setRegistrationMessage('This event is full!');
      setTimeout(() => setRegistrationMessage(''), 3000);
      return;
    }

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role as 'student' | 'staff',
      department: user.department,
      rollNo: user.rollNo,
      idNo: user.idNo,
      registeredAt: new Date().toISOString()
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

    setRegistrationMessage('Successfully registered for the event!');
    setTimeout(() => setRegistrationMessage(''), 3000);
  };

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(reg => reg.eventId === eventId).length;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Events</h1>
          <p className="text-gray-600">Discover and register for exciting events</p>
        </div>

        {registrationMessage && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            registrationMessage.includes('Successfully')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {registrationMessage}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  registrationCount={getRegistrationCount(event.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  showActions={false}
                  registrationCount={getRegistrationCount(event.id)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}