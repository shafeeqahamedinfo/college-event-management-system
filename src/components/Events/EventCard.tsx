import React from 'react';
import { Calendar, Clock, MapPin, User, Tag, Users } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  showActions?: boolean;
  registrationCount?: number;
}

export function EventCard({ event, onRegister, showActions = true, registrationCount = 0 }: EventCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-800',
      'Cultural': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-green-100 text-green-800',
      'Technical': 'bg-orange-100 text-orange-800',
      'Workshop': 'bg-indigo-100 text-indigo-800',
      'Seminar': 'bg-gray-100 text-gray-800',
      'Competition': 'bg-red-100 text-red-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Other': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isEventFull = event.maxParticipants && registrationCount >= event.maxParticipants;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {event.imageUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            event.status === 'approved' 
              ? 'bg-green-100 text-green-800'
              : event.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {event.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>By {event.createdByName} ({event.createdByRole})</span>
          </div>

          {event.maxParticipants && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {registrationCount}/{event.maxParticipants} participants
                {isEventFull && <span className="text-red-600 ml-2">(Full)</span>}
              </span>
            </div>
          )}
        </div>

        {showActions && onRegister && event.status === 'approved' && (
          <button
            onClick={() => onRegister(event.id)}
            disabled={isEventFull}
            className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
              isEventFull
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-[1.02]'
            }`}
          >
            {isEventFull ? 'Event Full' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
}