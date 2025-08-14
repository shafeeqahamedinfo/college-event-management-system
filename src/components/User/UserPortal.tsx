import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { Event, Registration } from '../../types';
import { EventCard } from '../Events/EventCard';
import { EventForm } from '../Admin/EventForm';
import { useAuth } from '../../context/AuthContext';

export function UserPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'my-events' | 'registrations' | 'create'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedEvents: Event[] = JSON.parse(localStorage.getItem('events') || '[]');
    const savedRegistrations: Registration[] = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    setEvents(savedEvents);
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

  const approvedEvents = events.filter(e => e.status === 'approved');
  const myEvents = events.filter(e => e.createdBy === user?.id);
  const myRegistrations = registrations.filter(r => r.userId === user?.id);
  const registeredEvents = myRegistrations.map(reg => 
    events.find(event => event.id === reg.eventId)
  ).filter(Boolean) as Event[];

  const tabs = [
    { id: 'events', label: 'All Events', icon: Calendar },
    { id: 'my-events', label: 'My Events', icon: Calendar },
    { id: 'registrations', label: 'My Registrations', icon: Clock },
    { id: 'create', label: 'Create Event', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your events and registrations</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Events</p>
                <p className="text-2xl font-semibold text-gray-900">{approvedEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Created Events</p>
                <p className="text-2xl font-semibold text-gray-900">{myEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Registrations</p>
                <p className="text-2xl font-semibold text-gray-900">{myRegistrations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myEvents.filter(e => e.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'events' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">All Available Events</h2>
              {approvedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={handleRegister}
                      registrationCount={getRegistrationCount(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No events available at the moment</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-events' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Created Events</h2>
              {myEvents.length > 0 ? (
                <div className="space-y-6">
                  {myEvents.some(e => e.status === 'pending') && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Approval</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myEvents.filter(e => e.status === 'pending').map(event => (
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
                  
                  {myEvents.some(e => e.status === 'approved') && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Approved Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myEvents.filter(e => e.status === 'approved').map(event => (
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
                  
                  {myEvents.some(e => e.status === 'rejected') && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Rejected Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myEvents.filter(e => e.status === 'rejected').map(event => (
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't created any events yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'registrations' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Registrations</h2>
              {registeredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registeredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showActions={false}
                      registrationCount={getRegistrationCount(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't registered for any events yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Event</h2>
              <EventForm onEventCreated={loadData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}